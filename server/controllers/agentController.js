const supabase = require('../services/supabase');
const openrouter = require('../services/openrouter');
const emailService = require('../services/emailService');
const { createDraftFromTask } = require('../services/draftService');

const generateTask = async (req, res, next) => {
  try {
    const { taskText } = req.body;
    const userId = req.user.id;
    if (!taskText) {
      return res.status(400).json({ error: 'taskText is required' });
    }

    const result = await createDraftFromTask(userId, taskText);

    if (result.needsEmailPrompt) {
      return res.status(200).json(result);
    }

    await supabase.from('activity_log').insert({
      user_id: userId,
      draft_id: result.draft.id,
      action: 'drafted',
      metadata: { taskText }
    });

    return res.status(200).json({
      message: 'Draft created successfully',
      draft: result.draft
    });
  } catch (error) {
    next(error);
  }
};

const sendDraft = async (req, res, next) => {
  try {
    const { draftId } = req.body;
    const userId = req.user.id;
    if (!draftId) {
      return res.status(400).json({ error: 'draftId is required' });
    }

    // 1. Verify ownership and status
    const { data: draft, error: fetchError } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', userId)
      .in('status', ['pending_review', 'undoing'])
      .single();

    if (fetchError || !draft) {
      return res.status(403).json({ error: 'Draft not found or cannot be sent in current status' });
    }
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draft.to_email)) {
      return res.status(400).json({ error: 'Invalid recipient email address' });
    }

    // 2. Set to approved immediately
    const { error: updateError } = await supabase
      .from('drafts')
      .update({ status: 'approved' })
      .eq('id', draftId);
    
    if (updateError) throw updateError;

    // Log approval
    await supabase.from('activity_log').insert({
      user_id: userId,
      draft_id: draftId,
      action: 'approved'
    });

    // 3. Schedule the actual send 30 seconds from now
    setTimeout(async () => {
      try {
        // Re-check status before sending
        const { data: latestDraft } = await supabase
          .from('drafts')
          .select('status, to_email, subject, body')
          .eq('id', draftId)
          .single();
        
        if (latestDraft && latestDraft.status === 'approved') {
          // Fire send via email service
          await emailService.sendEmail(latestDraft.to_email, latestDraft.subject, latestDraft.body);
          
          // Update status to sent
          await supabase
            .from('drafts')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('id', draftId);
          
          // Log sent activity
          await supabase.from('activity_log').insert({
            user_id: userId,
            draft_id: draftId,
            action: 'sent'
          });
          console.log(`Successfully sent draft ${draftId} to ${latestDraft.to_email}`);
        } else {
          console.log(`Send aborted for draft ${draftId}. Status is ${latestDraft?.status}`);
        }
      } catch (err) {
        console.error('Scheduled send failed:', err);
        // Update status to failed
        await supabase
          .from('drafts')
          .update({ status: 'failed' })
          .eq('id', draftId);
          
        await supabase.from('activity_log').insert({
          user_id: userId,
          draft_id: draftId,
          action: 'failed'
        });
      }
    }, 30000); // 30 seconds

    return res.status(200).json({
      message: 'Draft approved. Will send in 30 seconds.',
      draftId,
      status: 'approved'
    });

  } catch (error) {
    next(error);
  }
};

const undoSend = async (req, res, next) => {
  try {
    const { draftId } = req.body;
    const userId = req.user.id;
    if (!draftId) {
      return res.status(400).json({ error: 'draftId is required' });
    }

    // Check if within 30-second window
    const { data: draft, error: fetchError } = await supabase
      .from('drafts')
      .select('status, created_at, sent_at')
      .eq('id', draftId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    if (draft.status !== 'approved' || draft.sent_at !== null) {
      return res.status(400).json({ error: 'Cannot undo. Draft has already been sent or is not in approved status.' });
    }

    // Set status to undoing
    const { error: updateError } = await supabase
      .from('drafts')
      .update({ status: 'undoing' })
      .eq('id', draftId);

    if (updateError) throw updateError;

    // Log undone
    await supabase.from('activity_log').insert({
      user_id: userId,
      draft_id: draftId,
      action: 'undone'
    });

    return res.status(200).json({
      message: 'Send successfully undone.',
      draftId,
      status: 'undoing'
    });

  } catch (error) {
    next(error);
  }
};

const scheduleTask = async (req, res, next) => {
  try {
    const { taskText, recurrenceRule, followUpAfterDays } = req.body;
    const userId = req.user.id;
    if (!taskText) {
      return res.status(400).json({ error: 'taskText is required' });
    }
    
    let nextRun = new Date();
    
    if (recurrenceRule) {
      const rule = recurrenceRule.toLowerCase().trim();
      if (!['daily', 'weekly', 'monthly'].includes(rule)) {
        return res.status(400).json({ error: "Invalid recurrenceRule. Must be 'daily', 'weekly', or 'monthly'" });
      }
      
      if (rule === 'daily') {
        nextRun.setDate(nextRun.getDate() + 1);
      } else if (rule === 'weekly') {
        nextRun.setDate(nextRun.getDate() + 7);
      } else if (rule === 'monthly') {
        nextRun.setMonth(nextRun.getMonth() + 1);
      }
    } else if (followUpAfterDays) {
      const days = parseInt(followUpAfterDays, 10);
      if (isNaN(days) || days <= 0) {
        return res.status(400).json({ error: 'followUpAfterDays must be a positive integer' });
      }
      nextRun.setDate(nextRun.getDate() + days);
    }

    const { data, error } = await supabase.from('scheduled_tasks').insert({
      user_id: userId,
      task_text: taskText,
      recurrence_rule: recurrenceRule,
      follow_up_after_days: followUpAfterDays,
      next_run_at: nextRun.toISOString()
    }).select().single();

    if (error) throw error;

    return res.status(201).json({ message: 'Task scheduled', data });
  } catch (error) {
    next(error);
  }
};

const rejectDraft = async (req, res, next) => {
  try {
    const { draftId } = req.body;
    const userId = req.user.id;
    if (!draftId) {
      return res.status(400).json({ error: 'draftId is required' });
    }

    // Verify ownership and status
    const { data: draft, error: fetchError } = await supabase
      .from('drafts')
      .select('status')
      .eq('id', draftId)
      .eq('user_id', userId)
      .in('status', ['pending_review', 'approved'])
      .single();

    if (fetchError || !draft) {
      return res.status(404).json({ error: 'Draft not found or cannot be rejected in its current status' });
    }

    const { error: updateError } = await supabase
      .from('drafts')
      .update({ status: 'rejected' })
      .eq('id', draftId);

    if (updateError) throw updateError;

    await supabase.from('activity_log').insert({
      user_id: userId,
      draft_id: draftId,
      action: 'rejected'
    });

    return res.status(200).json({ message: 'Draft rejected successfully' });
  } catch (error) {
    next(error);
  }
};

const checkDraftStatus = async (req, res, next) => {
  try {
    const draftId = req.params.id;
    const userId = req.user.id;

    if (!draftId) {
      return res.status(400).json({ error: 'draftId is required' });
    }

    const { data: draft, error } = await supabase
      .from('drafts')
      .select('status')
      .eq('id', draftId)
      .eq('user_id', userId)
      .single();

    if (error || !draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    return res.status(200).json({ status: draft.status });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTask,
  sendDraft,
  undoSend,
  scheduleTask,
  rejectDraft,
  checkDraftStatus
};

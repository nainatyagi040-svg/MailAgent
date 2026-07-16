const supabase = require('../services/supabase');
const openrouter = require('../services/openrouter');
const mailtrap = require('../services/mailtrap');

const generateTask = async (req, res, next) => {
  try {
    const { taskText, userId } = req.body;
    if (!taskText || !userId) {
      return res.status(400).json({ error: 'taskText and userId are required' });
    }

    // 1. Check for matching templates (simple keyword match)
    const { data: templates } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId);

    let templateContext = null;
    if (templates && templates.length > 0) {
      const lowerTask = taskText.toLowerCase();
      // Simple match: if the task text contains the template name
      const matched = templates.find(t => lowerTask.includes(t.name.toLowerCase()));
      if (matched) {
        templateContext = matched;
      }
    }
    
    const draftData = await openrouter.generateEmailDraft(taskText, null, templateContext);

    if (!draftData.recipientName || draftData.recipientName.trim() === '') {
      return res.status(200).json({
        message: 'Recipient name could not be resolved from the task text.',
        needsEmailPrompt: true
      });
    }

    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('email, relationship_context')
      .eq('user_id', userId)
      .ilike('name', `%${draftData.recipientName}%`)
      .limit(1);

    if (contactError) throw contactError;

    let toEmail = null;
    let relationshipContext = null;

    if (contacts && contacts.length > 0) {
      toEmail = contacts[0].email;
      relationshipContext = contacts[0].relationship_context;
    }

    if (!toEmail) {
      return res.status(200).json({
        message: `Contact "${draftData.recipientName}" not found. Please provide an email address.`,
        needsEmailPrompt: true,
        draftData
      });
    }

    let finalDraft = draftData;
    if (relationshipContext) {
      finalDraft = await openrouter.generateEmailDraft(taskText, relationshipContext, templateContext);
    }

    const { data: draftRecord, error: draftError } = await supabase
      .from('drafts')
      .insert({
        user_id: userId,
        task_text: taskText,
        to_email: toEmail,
        subject: finalDraft.subject,
        body: finalDraft.body,
        tone: relationshipContext || 'neutral',
        status: 'pending_review'
      })
      .select()
      .single();

    if (draftError) throw draftError;

    await supabase.from('activity_log').insert({
      user_id: userId,
      draft_id: draftRecord.id,
      action: 'drafted',
      metadata: { taskText }
    });

    return res.status(200).json({
      message: 'Draft created successfully',
      draft: draftRecord
    });
  } catch (error) {
    next(error);
  }
};

const sendDraft = async (req, res, next) => {
  try {
    const { draftId, userId } = req.body;
    if (!draftId || !userId) {
      return res.status(400).json({ error: 'draftId and userId are required' });
    }

    // 1. Verify ownership and status
    const { data: draft, error: fetchError } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', userId)
      .in('status', ['pending_review', 'approved'])
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
          // Fire send via Mailtrap
          await mailtrap.sendEmail(latestDraft.to_email, latestDraft.subject, latestDraft.body);
          
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
    const { draftId, userId } = req.body;
    if (!draftId || !userId) {
      return res.status(400).json({ error: 'draftId and userId are required' });
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
    const { taskText, userId, recurrenceRule, followUpAfterDays } = req.body;
    if (!taskText || !userId) {
      return res.status(400).json({ error: 'taskText and userId are required' });
    }

    const { data, error } = await supabase.from('scheduled_tasks').insert({
      user_id: userId,
      task_text: taskText,
      recurrence_rule: recurrenceRule,
      follow_up_after_days: followUpAfterDays,
      next_run_at: new Date().toISOString() // Or calculate based on recurrence rule / days
    }).select().single();

    if (error) throw error;

    return res.status(201).json({ message: 'Task scheduled', data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateTask,
  sendDraft,
  undoSend,
  scheduleTask
};

const cron = require('node-cron');
const supabase = require('./supabase');
const { createDraftFromTask } = require('./draftService');

const startScheduler = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      const now = new Date().toISOString();
      const { data: tasks, error } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .lte('next_run_at', now)
        .eq('status', 'active');

      if (error) throw error;

      for (const task of tasks) {
        // Handle recurring task logic
        if (task.recurrence_rule) {
          console.log(`Executing recurring task ${task.id}`);
          
          try {
            const result = await createDraftFromTask(task.user_id, task.task_text);
            if (result.draft) {
              await supabase.from('activity_log').insert({
                user_id: task.user_id,
                draft_id: result.draft.id,
                action: 'drafted',
                metadata: { scheduled_task_id: task.id }
              });
            }
          } catch (err) {
            console.error(`Failed to create draft for task ${task.id}:`, err);
          }

          // Parse recurrence rule
          let nextRun = new Date();
          let validRule = true;
          const rule = task.recurrence_rule.toLowerCase().trim();
          
          if (rule === 'daily') {
            nextRun.setDate(nextRun.getDate() + 1);
          } else if (rule === 'weekly') {
            nextRun.setDate(nextRun.getDate() + 7);
          } else if (rule === 'monthly') {
            nextRun.setMonth(nextRun.getMonth() + 1);
          } else {
            console.warn(`Unrecognized recurrence rule '${rule}' for task ${task.id}. Skipping rescheduling.`);
            validRule = false;
          }

          if (validRule) {
            await supabase.from('scheduled_tasks').update({
              next_run_at: nextRun.toISOString()
            }).eq('id', task.id);
          } else {
            await supabase.from('scheduled_tasks').update({ status: 'completed' }).eq('id', task.id);
          }
        }

        // Follow up logic
        else if (task.follow_up_after_days) {
           console.log(`Executing follow-up task ${task.id}`);
           
           try {
             const result = await createDraftFromTask(task.user_id, task.task_text);
             if (result.draft) {
               await supabase.from('activity_log').insert({
                 user_id: task.user_id,
                 draft_id: result.draft.id,
                 action: 'follow_up_scheduled',
                 metadata: { scheduled_task_id: task.id }
               });
             }
           } catch (err) {
             console.error(`Failed to create follow-up draft for task ${task.id}:`, err);
           }

           await supabase.from('scheduled_tasks').update({ status: 'completed' }).eq('id', task.id);
        }
      }
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  });

  console.log('Scheduler started');
};

module.exports = { startScheduler };

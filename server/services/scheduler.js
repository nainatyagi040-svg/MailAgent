const cron = require('node-cron');
const supabase = require('./supabase');
const { createDraftFromTask } = require('./draftService');

const startScheduler = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      const now = new Date().toISOString();
      
      // Step 1: Select active tasks due for execution
      const { data: tasksToProcess, error: selectError } = await supabase
        .from('scheduled_tasks')
        .select('id')
        .lte('next_run_at', now)
        .eq('status', 'active');

      if (selectError) throw selectError;
      if (!tasksToProcess || tasksToProcess.length === 0) return;

      const taskIds = tasksToProcess.map(t => t.id);

      // Step 2: Atomically mark them as processing to prevent overlapping runs
      const { data: tasks, error: updateError } = await supabase
        .from('scheduled_tasks')
        .update({ status: 'processing' })
        .in('id', taskIds)
        .eq('status', 'active')
        .select('*');

      if (updateError) throw updateError;

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
            // On failure, we still reschedule. Real production systems might retry or mark failed.
          }

          // Parse recurrence rule and calculate nextRun from the scheduled next_run_at, not now
          let nextRun = new Date(task.next_run_at);
          let validRule = true;
          const rule = task.recurrence_rule.toLowerCase().trim();
          
          if (rule === 'daily') {
            nextRun.setDate(nextRun.getDate() + 1);
          } else if (rule === 'weekly') {
            nextRun.setDate(nextRun.getDate() + 7);
          } else if (rule === 'monthly') {
            const originalDay = new Date(task.created_at).getDate();
            const targetMonth = nextRun.getMonth() + 1;
            nextRun.setDate(1); // prevent temp overflow
            nextRun.setMonth(targetMonth);
            nextRun.setDate(originalDay);
            if (nextRun.getMonth() !== targetMonth % 12) {
              nextRun.setDate(0);
            }
          } else {
            console.warn(`Unrecognized recurrence rule '${rule}' for task ${task.id}. Skipping rescheduling.`);
            validRule = false;
          }

          // Catch up if the nextRun is still in the past
          const currentTime = new Date().getTime();
          while (nextRun.getTime() <= currentTime && validRule) {
            if (rule === 'daily') nextRun.setDate(nextRun.getDate() + 1);
            else if (rule === 'weekly') nextRun.setDate(nextRun.getDate() + 7);
            else if (rule === 'monthly') {
              const originalDay = new Date(task.created_at).getDate();
              const targetMonth = nextRun.getMonth() + 1;
              nextRun.setDate(1);
              nextRun.setMonth(targetMonth);
              nextRun.setDate(originalDay);
              if (nextRun.getMonth() !== targetMonth % 12) nextRun.setDate(0);
            }
          }

          if (validRule) {
            await supabase.from('scheduled_tasks').update({
              next_run_at: nextRun.toISOString(),
              status: 'active'
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

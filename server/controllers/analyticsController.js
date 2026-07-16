const supabase = require('../services/supabase');

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total sent
    const { count: sentCount, error: sentError } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'sent');
    if (sentError) throw sentError;

    // Total pending
    const { count: pendingCount, error: pendingError } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['pending_review', 'approved']);
    if (pendingError) throw pendingError;

    // Send counts by day (last 30 days)
    // For simplicity without complex raw SQL queries via Supabase JS client, we fetch recent sent activity and group it in JS
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentSent, error: recentError } = await supabase
      .from('activity_log')
      .select('timestamp')
      .eq('user_id', userId)
      .eq('action', 'sent')
      .gte('timestamp', thirtyDaysAgo);
    
    if (recentError) throw recentError;

    const sendsByDay = {};
    recentSent.forEach(record => {
      const day = record.timestamp.split('T')[0];
      sendsByDay[day] = (sendsByDay[day] || 0) + 1;
    });

    res.json({
      totalSent: sentCount || 0,
      totalPending: pendingCount || 0,
      sendsByDay
    });
  } catch (err) { next(err); }
};

module.exports = { getAnalytics };

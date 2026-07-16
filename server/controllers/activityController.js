const supabase = require('../services/supabase');

const listActivity = async (req, res, next) => {
  try {
    const { userId, limit = 50, offset = 0, status } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    let query = supabase
      .from('activity_log')
      .select('*, drafts(*)')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      // Assuming filtering by action instead of status since it's activity log
      query = query.eq('action', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

module.exports = { listActivity };

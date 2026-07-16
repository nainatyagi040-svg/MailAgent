const supabase = require('../services/supabase');

const listActivity = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    const userId = req.user.id;

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

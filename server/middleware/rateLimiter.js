const supabase = require('../services/supabase');

const checkRateLimit = (actionType, limit) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: missing user id' });
      }

      const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago

      // Check current count
      const { data: limits, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('action_type', actionType)
        .gte('window_start', windowStart);

      if (error) throw error;

      let currentCount = 0;
      let recordId = null;

      if (limits && limits.length > 0) {
        currentCount = limits[0].count;
        recordId = limits[0].id;
      }

      if (currentCount >= limit) {
        return res.status(429).json({ error: `Rate limit exceeded for ${actionType}` });
      }

      // Increment count
      if (recordId) {
        await supabase
          .from('rate_limits')
          .update({ count: currentCount + 1 })
          .eq('id', recordId);
      } else {
        await supabase
          .from('rate_limits')
          .insert({
            user_id: userId,
            action_type: actionType,
            count: 1,
            window_start: new Date().toISOString()
          });
      }

      next();
    } catch (error) {
      console.error('Rate Limiter Error:', error);
      return res.status(503).json({ error: 'Rate limiting temporarily unavailable, please try again shortly' });
    }
  };
};

module.exports = {
  checkRateLimit
};

const supabase = require('../services/supabase');

const checkRateLimit = (actionType, maxLimitPerHour) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      // Find existing rate limit record for this hour
      let { data, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('action_type', actionType)
        .gte('window_start', oneHourAgo)
        .order('window_start', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "No rows found"
        throw error;
      }

      if (data) {
        if (data.count >= maxLimitPerHour) {
          return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
        }
        
        // Increment
        await supabase
          .from('rate_limits')
          .update({ count: data.count + 1 })
          .eq('id', data.id);
      } else {
        // Create new window
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
    } catch (err) {
      console.error('Rate Limiter Error:', err);
      // Fallback to allow if db fails, or could block. Better to block or pass based on policy.
      next();
    }
  };
};

module.exports = {
  checkRateLimit
};

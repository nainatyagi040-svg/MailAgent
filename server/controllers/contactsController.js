const supabase = require('../services/supabase');

const createContact = async (req, res, next) => {
  try {
    const { userId, name, email, relationship_context } = req.body;
    if (!userId || !name || !email) return res.status(400).json({ error: 'Missing fields' });

    const { data, error } = await supabase.from('contacts').insert({
      user_id: userId, name, email, relationship_context
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) { next(err); }
};

const listContacts = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabase.from('contacts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, name, email, relationship_context } = req.body;
    
    const { data, error } = await supabase.from('contacts').update({
      name, email, relationship_context
    }).eq('id', id).eq('user_id', userId).select().single();

    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const { error } = await supabase.from('contacts').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { createContact, listContacts, updateContact, deleteContact };

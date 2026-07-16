const supabase = require('../services/supabase');

const createTemplate = async (req, res, next) => {
  try {
    const { name, subject_template, body_template } = req.body;
    const userId = req.user.id;
    if (!name || !subject_template || !body_template) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { data, error } = await supabase.from('templates').insert({
      user_id: userId, name, subject_template, body_template
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) { next(err); }
};

const listTemplates = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase.from('templates').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subject_template, body_template } = req.body;
    const userId = req.user.id;
    
    const { data, error } = await supabase.from('templates').update({
      name, subject_template, body_template
    }).eq('id', id).eq('user_id', userId).select().single();

    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { error } = await supabase.from('templates').delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { createTemplate, listTemplates, updateTemplate, deleteTemplate };

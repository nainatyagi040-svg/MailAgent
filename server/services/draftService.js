const supabase = require('./supabase');
const openrouter = require('./openrouter');

const createDraftFromTask = async (userId, taskText, extraMetadata = {}) => {
  // 1. Check for matching templates (simple keyword match)
  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .eq('user_id', userId);

  let templateContext = null;
  if (templates && templates.length > 0) {
    const lowerTask = taskText.toLowerCase();
    const matched = templates.find(t => lowerTask.includes(t.name.toLowerCase()));
    if (matched) {
      templateContext = matched;
    }
  }
  
  const draftData = await openrouter.generateEmailDraft(taskText, null, templateContext);

  if (!draftData.recipientName || draftData.recipientName.trim() === '') {
    return {
      message: 'Recipient name could not be resolved from the task text.',
      needsEmailPrompt: true,
      draftData
    };
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
    return {
      message: `Contact "${draftData.recipientName}" not found. Please provide an email address.`,
      needsEmailPrompt: true,
      draftData
    };
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

  return {
    draft: draftRecord,
    needsEmailPrompt: false
  };
};

module.exports = {
  createDraftFromTask
};

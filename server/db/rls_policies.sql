-- Enable Row Level Security on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies to restrict access based on auth.uid() = user_id
CREATE POLICY "Users can only access their own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own drafts" ON drafts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own templates" ON templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own activity log" ON activity_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own scheduled tasks" ON scheduled_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own rate limits" ON rate_limits FOR ALL USING (auth.uid() = user_id);

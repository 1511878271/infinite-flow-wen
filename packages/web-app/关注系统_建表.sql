-- 创建关注表
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL, -- 关注者的 user_id
  target_persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE, -- 被关注的人格卡片 ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(follower_id, target_persona_id) -- 防止重复关注
);

-- 为 personas 表添加扩展字段（用于灵魂蒸馏）
ALTER TABLE personas ADD COLUMN IF NOT EXISTS mbti_type VARCHAR(50);
ALTER TABLE personas ADD COLUMN IF NOT EXISTS custom_traits TEXT;

-- RLS 策略 (允许用户查看自己的关注，允许关注和取消关注)
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'follows' AND policyname = 'Users can view their own follows') THEN
        CREATE POLICY "Users can view their own follows" ON follows FOR SELECT USING (auth.uid() = follower_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'follows' AND policyname = 'Users can insert their own follows') THEN
        CREATE POLICY "Users can insert their own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'follows' AND policyname = 'Users can delete their own follows') THEN
        CREATE POLICY "Users can delete their own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);
    END IF;
END $$;

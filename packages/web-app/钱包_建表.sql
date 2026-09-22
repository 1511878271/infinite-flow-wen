-- 1. 用户钱包表 (user_wallets)
CREATE TABLE IF NOT EXISTS public.user_wallets (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    balance INTEGER NOT NULL DEFAULT 0, -- 当前剩余积分
    total_recharged INTEGER NOT NULL DEFAULT 0, -- 历史总充值积分
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 开启 RLS
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- 允许用户查看自己的钱包 (使用 DO 块避免策略重复创建报错)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_wallets' AND policyname = 'Users can view their own wallet'
    ) THEN
        CREATE POLICY "Users can view their own wallet" 
            ON public.user_wallets FOR SELECT 
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 钱包记录在用户注册时最好通过触发器自动创建，这里先提供基础权限，通常只有服务端(Service Role)有权限修改余额


-- 2. 交易流水表 (transaction_logs)
CREATE TABLE IF NOT EXISTS public.transaction_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- 变动数量，正数代表增加，负数代表扣除
    type VARCHAR(50) NOT NULL, -- 交易类型，例如: 'recharge_wechat', 'consume_t2i', 'consume_i23d', 'gift_daily'
    description VARCHAR(255), -- 交易描述，例如: '微信充值 1000 积分', '生成 3D 模型扣除'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 开启 RLS
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;

-- 允许用户查看自己的流水
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'transaction_logs' AND policyname = 'Users can view their own transaction logs'
    ) THEN
        CREATE POLICY "Users can view their own transaction logs" 
            ON public.transaction_logs FOR SELECT 
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 允许服务端(Service Role)插入流水，前端不应该直接写流水表


-- 3. 自动创建钱包的触发器 (可选，但推荐：当新用户注册时自动分配初始积分)
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_wallets (user_id, balance, total_recharged)
    VALUES (new.id, 100, 0); -- 新用户默认赠送 100 积分体验
    
    INSERT INTO public.transaction_logs (user_id, amount, type, description)
    VALUES (new.id, 100, 'gift_register', '新用户注册赠送积分');
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定触发器到 auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_wallet();

-- 4. 通知 PostgREST 重新加载 schema
NOTIFY pgrst, 'reload schema';

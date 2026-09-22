-- 兑换码/卡密表 (gift_codes)
CREATE TABLE IF NOT EXISTS public.gift_codes (
    code VARCHAR(50) PRIMARY KEY, -- 卡密，如 'VIP-1234-5678'
    credits INTEGER NOT NULL, -- 该卡密包含的积分点数
    is_used BOOLEAN NOT NULL DEFAULT FALSE, -- 是否已被使用
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 谁使用了这个卡密
    used_at TIMESTAMP WITH TIME ZONE, -- 使用时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 开启 RLS
ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;

-- 只有服务端 (Service Role) 拥有所有权限，普通用户只能通过后端的特权接口进行核销，不能直接读取或修改该表
-- 因此不需要为普通用户创建 Policy

-- 预生成几个测试用的兑换码 (仅供你测试使用)
INSERT INTO public.gift_codes (code, credits)
VALUES 
    ('TEST-1000', 1000),
    ('TEST-3500', 3500),
    ('BOSS-9999', 9999)
ON CONFLICT (code) DO NOTHING;

-- 通知 PostgREST 重新加载 schema
NOTIFY pgrst, 'reload schema';

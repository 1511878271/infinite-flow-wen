import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function generateCode(prefix: string): string {
  // 生成类似 PREFIX-XXXX-YYYY-ZZZZ 的随机码
  const rand = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `${prefix}-${rand.slice(0, 4)}-${rand.slice(4, 8)}-${rand.slice(8, 12)}`;
}

async function main() {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 5; // 默认生成5个
  const points = parseInt(args[1]) || 1000; // 默认面值1000
  const prefix = args[2] || "GIFT"; // 默认前缀

  console.log(`正在生成 ${count} 个面值为 ${points} 积分的兑换码...`);

  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push({
      code: generateCode(prefix),
      amount: points,
      is_used: false,
    });
  }

  const { data, error } = await sb.from("gift_codes").insert(codes).select("code, amount");

  if (error) {
    console.error("生成失败:", error);
  } else {
    console.log("\n生成成功！以下是您的兑换码：");
    console.log("======================================");
    data.forEach((item, i) => {
      console.log(`[${i + 1}] 兑换码: ${item.code.padEnd(20)} | 面值: ${item.amount} 积分`);
    });
    console.log("======================================");
  }
}

main();

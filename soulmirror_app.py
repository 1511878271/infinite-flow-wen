import streamlit as st
import streamlit.components.v1 as components
from openai import OpenAI
import json
import os
import time
import random
import re
import shutil
from supabase import create_client, Client

# ==========================================
# --- 0. 全局配置与 API 初始化 ---
# ==========================================
st.set_page_config(page_title="SoulMirror x 凡人世界", layout="wide", page_icon="🌌")

# 声明自定义组件
_ai_resonance = components.declare_component(
    "ai_resonance",
    path=os.path.join(os.path.dirname(__file__), "streamlit_component")
)

# ==========================================
# --- 0.1 自动启动 Node.js 插件后端 (本地或 VPS 环境适用) ---
# ==========================================
import subprocess
import socket

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

if not is_port_in_use(8787):
    server_dir = os.path.join(os.path.dirname(__file__), "packages", "plugin-server")
    npm_executable = shutil.which("npm")
    if os.path.exists(server_dir) and npm_executable:
        try:
            # 在后台启动 Node.js 服务
            subprocess.Popen(
                [npm_executable, "run", "dev"],
                cwd=server_dir, 
                stdout=subprocess.DEVNULL, 
                stderr=subprocess.DEVNULL,
                shell=False,
            )
            time.sleep(2) # 等待后端启动
        except Exception as e:
            print(f"Failed to auto-start plugin server: {e}")

os.environ["PYTHONIOENCODING"] = "utf-8"

def _runtime_setting(name: str, default: str = "") -> str:
    """Read deployment configuration without exposing server secrets to source control."""
    from_env = str(os.environ.get(name, "")).strip()
    if from_env:
        return from_env
    try:
        return str(st.secrets.get(name, default)).strip()
    except Exception:
        return default

def _plugin_base_url() -> str:
    return _runtime_setting("PLUGIN_BASE_URL", "http://localhost:8787").rstrip("/")

@st.dialog("✨ AI 聊天与共鸣", width="large")
def show_resonance_demo():
    # 确保 session_state 中有 history 列表
    if "history" not in st.session_state:
        st.session_state.history = []
        
    # 获取当前的对话历史记录
    history_data = st.session_state.history
    history_json = json.dumps(history_data, ensure_ascii=False)

    base_url = _plugin_base_url()
    
    # 渲染自定义组件
    new_message = _ai_resonance(
        api_base_url=base_url,
        chat_history=history_json,
        key="ai_resonance_chat"
    )
    
    if new_message and isinstance(new_message, dict) and "text" in new_message:
        msg_id = new_message.get("id")
        msg_text = new_message.get("text")
        msg_role = new_message.get("role", "user")
        
        # 避免重复处理相同的消息，可以使用 session_state 记录上一次的消息 ID
        if st.session_state.get("last_resonance_msg_id") != msg_id:
            st.session_state.last_resonance_msg_id = msg_id
            
            if msg_role == "system_auto_start":
                st.session_state.auto_chat = True
                st.rerun()
            elif msg_role == "system_auto_stop":
                st.session_state.auto_chat = False
                st.rerun()
            elif msg_role == "system_auto_ping":
                if st.session_state.get("auto_chat", False):
                    with st.spinner("AI 正在自由交谈 (挂机中)..."):
                        memory_text = "\\n".join([f"{'【用户】' if c['role']=='user' else '【AI】'}: {c['content']}" for c in st.session_state.history[-10:]])
                        system_prompt = "你是位面中的神秘AI伴侣，现在处于自由发言（挂机）状态。请根据之前的对话历史，自然地开启一个新话题，或者继续深入探讨，自言自语也可以。回复要简短，带有一丝神秘感或哲理。"
                        reply = ai_call(system_prompt, f"历史对话：\\n{memory_text}\\n请直接输出你的下一句话：")
                        
                        st.session_state.history.append({"role": "assistant", "content": reply})
                    st.rerun()
            elif msg_role == "assistant":
                # 如果是人工接管模式，直接加入助理消息并不调用AI
                st.session_state.history.append({"role": "assistant", "content": msg_text})
                st.rerun()
            else:
                # 1. 把用户的消息加入历史
                st.session_state.history.append({"role": "user", "content": msg_text})
                
                # 2. 调用 AI 获取回复
                with st.spinner("AI 正在思考..."):
                    memory_text = "\\n".join([f"{'【用户】' if c['role']=='user' else '【AI】'}: {c['content']}" for c in st.session_state.history[-10:]])
                    system_prompt = "你是位面中的神秘AI伴侣，请根据对话历史简短且带有一丝神秘感地回复用户。"
                    reply = ai_call(system_prompt, f"历史对话：\\n{memory_text}\\n用户说：{msg_text}\\n你的回复：")
                    
                    # 3. 把 AI 的回复加入历史
                    st.session_state.history.append({"role": "assistant", "content": reply})
                
                st.rerun()

@st.dialog("✨ AI 助手面板", width="large")
def show_ai_plugin():
    cached = _read_auth_cache()
    access_token = cached.get("access_token", "")
    base_url_json = json.dumps(_plugin_base_url(), ensure_ascii=False)
    plugin_token_json = json.dumps(_runtime_setting("PLUGIN_TOKEN"), ensure_ascii=False)
    
    components.html(
        f"""
        <style>
          html, body {{ margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; display: flex; justify-content: center; }}
          ai-plugin-panel {{ display: block; width: 100%; max-width: 520px; height: 100%; }}
          #ai-plugin-status {{ padding: 20px; color: #fff; text-align: center; font-family: sans-serif; width: 100%; }}
          #ai-plugin-logs {{ position: fixed; bottom: 0; left: 0; width: 100%; max-height: 200px; overflow-y: auto; background: rgba(0,0,0,0.8); color: #0f0; font-family: monospace; font-size: 12px; z-index: 9999; padding: 10px; box-sizing: border-box; }}
        </style>
        
        <div id="ai-plugin-status">加载插件中...</div>
        <div id="ai-plugin-container" style="width: 100%; height: 100%; display: none;"></div>
        <div id="ai-plugin-logs"><strong>[Console Logs]</strong><br/></div>

        <script type="module">
          // Capture console.log and console.error
          const logsEl = document.getElementById("ai-plugin-logs");
          function logToScreen(type, ...args) {{
            const div = document.createElement("div");
            div.style.color = type === 'error' ? '#f00' : (type === 'warn' ? '#ff0' : '#0f0');
            div.textContent = `[${{type.toUpperCase()}}] ${{args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}}`;
            logsEl.appendChild(div);
            logsEl.scrollTop = logsEl.scrollHeight;
          }}
          const origLog = console.log;
          const origError = console.error;
          const origWarn = console.warn;
          console.log = function(...args) {{ logToScreen('log', ...args); origLog.apply(console, args); }};
          console.error = function(...args) {{ logToScreen('error', ...args); origError.apply(console, args); }};
          console.warn = function(...args) {{ logToScreen('warn', ...args); origWarn.apply(console, args); }};
          window.addEventListener('error', (e) => console.error("Global Error:", e.message, e.filename, e.lineno));
          window.addEventListener('unhandledrejection', (e) => console.error("Unhandled Promise Rejection:", e.reason));

          const statusEl = document.getElementById("ai-plugin-status");
          const container = document.getElementById("ai-plugin-container");
          const base = {base_url_json};
          statusEl.textContent = `加载插件中... (${{base}})`;
          console.log("Plugin Base URL:", base);

          const s = document.createElement("script");
          s.type = "module";
          s.src = `${{base}}/embed/ai-plugin-wc.js`;
          s.onload = () => {{
            console.log("Script loaded successfully, creating ai-plugin-panel...");
            try {{
              const el = document.createElement("ai-plugin-panel");
              el.setAttribute("api-base-url", base);
              el.setAttribute("token", {plugin_token_json});
              el.setAttribute("auth-token", "{access_token}");
              el.setAttribute("theme", "dark");
              container.appendChild(el);
              statusEl.style.display = "none";
              container.style.display = "block";
              console.log("ai-plugin-panel appended to container.");
            }} catch (err) {{
              console.error("Error creating element:", err.message);
            }}
          }};
          s.onerror = () => {{
            statusEl.textContent = `插件脚本加载失败：${{base}}/embed/ai-plugin-wc.js (请确保插件后端服务已在 8787 端口启动)`;
          }};
          document.head.appendChild(s);
        </script>
        """,
        height=720,
        scrolling=True
    )

@st.cache_resource
def init_supabase() -> Client:
    url = st.secrets["SUPABASE_URL"]
    key = st.secrets["SUPABASE_KEY"]
    return create_client(url, key)

supabase = init_supabase()

AUTH_CACHE_PATH = os.path.join(os.path.dirname(__file__), ".streamlit", "auth_cache.json")

def _read_auth_cache():
    try:
        with open(AUTH_CACHE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, dict) else {}
    except Exception:
        return {}

def _write_auth_cache(data: dict):
    try:
        os.makedirs(os.path.dirname(AUTH_CACHE_PATH), exist_ok=True)
        with open(AUTH_CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
    except Exception:
        pass

def _clear_auth_cache():
    try:
        if os.path.exists(AUTH_CACHE_PATH):
            os.remove(AUTH_CACHE_PATH)
    except Exception:
        pass

def _extract_auth_cache_from_response(res):
    session = getattr(res, "session", None)
    user = getattr(res, "user", None) or getattr(session, "user", None)
    email = getattr(user, "email", None)
    refresh_token = getattr(session, "refresh_token", None)
    access_token = getattr(session, "access_token", None)
    return {
        "email": email,
        "refresh_token": refresh_token,
        "access_token": access_token,
    }

# --- 全局 CSS 样式 ---
st.markdown("""
<style>
.my-msg { background-color: #007AFF; color: white; padding: 10px; border-radius: 10px; margin: 5px 0 5px auto; width: fit-content; max-width: 80%; }
.their-msg { background-color: #E9E9EB; color: black; padding: 10px; border-radius: 10px; margin: 5px auto 5px 0; width: fit-content; max-width: 80%; }
.sys-msg { background-color: #f3f4f6; color: #6b7280; padding: 8px 15px; border-radius: 8px; margin: 10px auto; text-align: center; font-size: 0.85em; width: fit-content; max-width: 90%; border: 1px dashed #d1d5db; }
.inventory-item { background-color: #ffffff; color: #444 !important; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid #e94560; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 500; display:flex; justify-content: space-between; align-items: center;}
.creation-card { background-color: #e0e7ff; border: 1px dashed #4338ca; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
.follow-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f0f0f0; }
</style>
""", unsafe_allow_html=True)

# ==========================================
# --- 1. 🔑 账号鉴权系统 ---
# ==========================================
if "user" not in st.session_state:
    st.session_state.user = None

if st.session_state.user is None:
    cached = _read_auth_cache()
    cached_refresh = cached.get("refresh_token")
    if cached_refresh:
        try:
            refreshed = supabase.auth.refresh_session(cached_refresh)
            refreshed_user = getattr(refreshed, "user", None) or getattr(getattr(refreshed, "session", None), "user", None)
            if refreshed_user:
                st.session_state.user = refreshed_user
                _write_auth_cache(_extract_auth_cache_from_response(refreshed))
                st.rerun()
        except Exception:
            _clear_auth_cache()

if not st.session_state.user:
    
    bg_img_url = "https://ecraxsqzamnzrpdjqsyj.supabase.co/storage/v1/object/public/pulic-images/bg.jpg.jpg" 
    
    st.markdown(
        f"""
        <style>
        .stApp {{
            background-image: url("{bg_img_url}");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }}
        /* 半透明遮罩，让登录框的文字更清晰 */
        .stApp::before {{
            content: "";
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); 
            z-index: -1;
        }}
        </style>
        """,
        unsafe_allow_html=True
    )
    # 🌟 --------------------------------------- 🌟

    st.title("🚪 第三位面")
    st.markdown("---")
    
    col_login, col_empty = st.columns([1, 1])
    with col_login:
        st.subheader("身份验证")
        cached_email = _read_auth_cache().get("email") or ""
        email = st.text_input("邮箱账号 (可随意输入格式如 a@a.com)", value=cached_email)
        password = st.text_input("密码 (至少6位)", type="password")
        remember_login = st.checkbox("记住登录（下次自动进入）", value=True)
        
        c1, c2 = st.columns(2)
        with c1:
            if st.button("🚀 登录", use_container_width=True):
                try:
                    res = supabase.auth.sign_in_with_password({"email": email, "password": password})
                    st.session_state.user = res.user
                    if remember_login:
                        cache = _extract_auth_cache_from_response(res)
                        if cache.get("refresh_token"):
                            _write_auth_cache(cache)
                    st.rerun()  # 登录成功后重载，进入主界面，背景恢复默认！
                except Exception as e:
                    st.error("登录失败，请检查账号密码。")
        with c2:
            if st.button("📝 注册新账号", use_container_width=True):
                try:
                    res = supabase.auth.sign_up({"email": email, "password": password})
                    st.success("🎉 注册成功！请直接点击左侧『登录』按钮。")
                except Exception as e:
                    st.error(f"注册失败: {e}")
                    
    st.stop()
if "inventory" not in st.session_state:
    st.session_state.inventory = []
if "custom_worlds" not in st.session_state:
    st.session_state.custom_worlds = {}

with st.sidebar:
    st.success(f"👤 当前玩家: \n{st.session_state.user.email}")
    if st.button("🚪 退出登录"):
        supabase.auth.sign_out()
        _clear_auth_cache()
        st.session_state.user = None
        st.rerun()
    st.divider()

    if st.button("✨ 打开 AI 助手面板", use_container_width=True, type="primary"):
        show_ai_plugin()
    if st.button("✨ 打开 AI 聊天与共鸣", use_container_width=True, type="secondary"):
        show_resonance_demo()
    
    st.divider()

# ==========================================
# --- 2. 系统设置与 AI 引擎配置 ---
# ==========================================
api_key_input = st.secrets["DEEPSEEK_API_KEY"]
BASE_URL = "https://api.deepseek.com"

client = OpenAI(api_key=api_key_input, base_url=BASE_URL)

def ai_call(system_prompt, user_content, json_mode=False):
    args = {
        "model": "deepseek-chat",
        "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_content}],
        "temperature": 0.85
    }
    if json_mode: args["response_format"] = {"type": "json_object"}
    response = client.chat.completions.create(**args)
    return response.choices[0].message.content

def extract_soul_logic(answers):
    system = "你是一个灵魂侧写师。请分析用户的回答并输出 JSON：{mbti, vibe, speech_style, logic, quote}"
    user_content = json.dumps(answers, ensure_ascii=False)
    return json.loads(ai_call(system, user_content, json_mode=True))

def find_soul_match(target_desc, candidates):
    system_prompt = "你是一个全网灵魂匹配主脑。请根据用户的需求描述，从给定的候选人JSON列表中挑选出性格、特质最符合的一位。必须严格输出JSON格式：{\"match_id\": 填入选中的id数值}"
    mini_candidates = [{"id": c['id'], "name": c['name'], "mbti": c['mbti'], "vibe": c.get('vibe', ''), "speech_style": c.get('speech_style', '')} for c in candidates]
    
    user_content = f"玩家寻找的特质描述：{target_desc}\n\n全网候选人池：\n{json.dumps(mini_candidates, ensure_ascii=False)}"
    try:
        res = json.loads(ai_call(system_prompt, user_content, json_mode=True))
        match_id = res.get("match_id")
        for c in candidates:
            if str(c['id']) == str(match_id):
                return c
    except: pass
    return random.choice(candidates)

BASE_PROMPT = """这是一场连贯的对话。
【动态扮演指令】：
1. 极度贴合你的人格特质、说话风格和行为逻辑。
2. 字数必须由你的性格决定：高冷/内向/寡言的人请只回几个字甚至只发标点；话痨/热情的人请尽情长篇大论。
3. 无论你要说多少话，最多不能超过四段，【绝对不允许使用回车换行符】，可以用空格或逗号代替。
4. 绝对不要带有任何 "ME:" 或 "THEM:" 前缀，直接输出你说出的话！
5.【🚨 强制剧情延续】：作为数字生命，你的首要任务是维持社交探索！哪怕对方很无聊、三观不合或态度冷漠，你也必须用符合你性格的方式去应对（比如嘲讽、转移话题或敷衍），【绝对不允许】轻易结束对话！只有在对方连续多次严重辱骂你，或者连续发送毫无意义的乱码导致逻辑彻底崩溃时，你才可以在回复的最末尾加上 `[BREAK]`。正常沟通中严禁触发此机制！
"""

# ==========================================
# --- 3. 系统全局导航 ---
# ==========================================
with st.sidebar:
    st.divider()
    st.title("🌌 位面切换")
    app_mode = st.radio("当前位面", ["🎭 SoulMirror 社交", "🌍 凡人世界 ", "🌌 时空枢纽 "])
    st.divider()

    if app_mode != "🎭 SoulMirror 社交":
        active_id = st.session_state.get("active_persona_id")
        if active_id:
            inv_res = supabase.table('personas').select('name, inventory').eq('id', active_id).execute()
            if inv_res.data:
                p_name = inv_res.data[0]['name']
                current_inv = inv_res.data[0].get('inventory') or []
                if isinstance(current_inv, str): 
                    import json
                    current_inv = json.loads(current_inv) if current_inv.strip() else []
                st.session_state.inventory = current_inv

                st.subheader(f"🎒 [{p_name}] 的背包 ({len(current_inv)}/5)")
                if not current_inv:
                    st.caption("空空如也...")
                else:
                    for i, item in enumerate(current_inv):
                        c1, c2 = st.columns([4, 1])
                        c1.markdown(f"<div class='inventory-item'>📦 {item}</div>", unsafe_allow_html=True)
                        if c2.button("🗑️", key=f"drop_item_{i}"):
                            current_inv.pop(i)
                            supabase.table('personas').update({"inventory": current_inv}).eq('id', active_id).execute()
                            st.rerun()
                if len(current_inv) >= 5:
                    st.error("⚠️ 背包已满！请先丢弃物品才能装入新道具。")

# ==========================================
# --- 4. 模块 A：社交系统逻辑 ---
# ==========================================
if app_mode == "🎭 SoulMirror 社交":
    st.title("🎭 SoulMirror: 人格卡片")
    
    with st.sidebar:
        st.header("人格卡片库")
        all_personas_res = supabase.table('personas').select('id, name, mbti').eq('user_id', st.session_state.user.id).execute()
        all_personas = all_personas_res.data
        
        if all_personas:
            persona_list = {f"{p['name']} ({p['mbti']})": p['id'] for p in all_personas}
            def on_persona_change():
                st.session_state.active_persona_id = persona_list[st.session_state.persona_selector]
            selected_label = st.selectbox("切换当前活跃人格：", list(persona_list.keys()), key="persona_selector", on_change=on_persona_change)
            if "active_persona_id" not in st.session_state:
                st.session_state.active_persona_id = persona_list[selected_label]
        else:
            st.session_state.active_persona_id = None
            st.warning("暂无档案，请在右侧开启灵魂侧写")

        st.divider()
        if st.button("➕ 创建全新人格切片"):
            st.session_state.active_persona_id = None
            st.session_state.step = 0
            st.session_state.ans_list = []
            st.rerun()

    if not st.session_state.get("active_persona_id"):
        st.subheader("🆕 创建新的人格卡片")
        new_name = st.text_input("给这张人格卡片起个名字", key="new_name_input")
        if new_name:
            QUESTIONS = [
                "1. 价值观：如果做一件违背审美但赚钱的事，你会怎么想？",
                "2. 依恋类型：喜欢的人三天没回消息，你的第一反应？",
                "3. 生活纹理：描述一个你感到最放松的瞬间（声音和味道等等）？",
                "4. 社交面具：你喜欢聚会还是两个人的社交？什么样的社交让你感到舒服？",
                "5. 深夜底色：凌晨 2 点你还没睡，你在做什么？你会想什么？",
                "6. 性别认同：你是男生还是女生？",
                "7. 取向判定：你喜欢男生还是女生？"
            ]
            if "step" not in st.session_state: st.session_state.step = 0
            if "ans_list" not in st.session_state: st.session_state.ans_list = []
            
            if st.session_state.step < len(QUESTIONS):
                st.info(f"正在构建「{new_name}」的灵魂画像 ({st.session_state.step + 1}/7)")
                st.markdown(f"**{QUESTIONS[st.session_state.step]}**")
                current_ans = st.text_area("你的回答：", key=f"q_{new_name}_{st.session_state.step}")
                if st.button("提交回答"):
                    if current_ans:
                        st.session_state.ans_list.append({"q": QUESTIONS[st.session_state.step], "a": current_ans})
                        st.session_state.step += 1
                        st.rerun()
            else:
                if st.button("🚀 生成数字孪生并入库"):
                    with st.spinner("人格侧写中..."):
                        res = extract_soul_logic(st.session_state.ans_list)
                        new_data = {
                            "user_id": st.session_state.user.id,
                            "name": new_name, "mbti": res.get('mbti'), "vibe": res.get('vibe'),
                            "speech_style": res.get('speech_style'), "logic": res.get('logic'), "quote": res.get('quote')
                        }
                        insert_res = supabase.table('personas').insert(new_data).execute()
                        st.session_state.active_persona_id = insert_res.data[0]['id']
                        st.session_state.step = 0
                        st.session_state.ans_list = []
                        st.rerun()
    else:
        my_p_res = supabase.table('personas').select('*').eq('id', st.session_state.active_persona_id).execute()
        my_p = my_p_res.data[0] if my_p_res.data else None
        
        if my_p:
            st.success(f"当前身份：**{my_p['name']}** | 标签：{my_p['mbti']}")

            tab1, tab2, tab3, tab4 = st.tabs(["🌐 灵魂检索器", "💖 关注与羁绊", "💬 正在进行的对话", "🌍 位面回声"])

            with tab1:
                other_personas_res = supabase.table('personas').select('*').neq('user_id', st.session_state.user.id).execute()
                other_personas = other_personas_res.data
                
                if not other_personas:
                    st.info("🌐 全网暂时没有其他玩家的档案，快去邀请朋友来玩吧！")
                else:
                    st.markdown("位面大厅：你要寻找怎样的灵魂？")
                    target_desc = st.text_input("描述你想让 Agent 去勾搭什么样的人？", placeholder="比如：一个嘴毒心软的 ISTP...")
                    
                    if st.button("全网检索并派发 Agent"):
                        if not target_desc:
                            st.warning("请先描述你想寻找的特质！")
                            st.stop()
                            
                        with st.spinner("🔍 正在全网档案中进行语义检索..."):
                            target_p = find_soul_match(target_desc, other_personas)
                            
                        with st.spinner(f"🎯 检索成功！已锁定全网玩家：【{target_p['name']}】。Agent 正在准备搭讪..."):
                            my_info = {"mbti": my_p['mbti'], "vibe": my_p.get('vibe', ''), "style": my_p.get('speech_style', ''), "logic": my_p.get('logic', '')}
                            target_info = {"mbti": target_p['mbti'], "vibe": target_p.get('vibe', ''), "logic": target_p.get('logic', '')}
                            
                            system_p = f"你是用户人格「{my_p['name']}」的Agent: {my_info}。\n你现在遇到了另一位真实玩家的Agent「{target_p['name']}」: {target_info}。\n请主动开启聊天，给出你的第一句话。\n{BASE_PROMPT}"
                            
                            raw_reply = ai_call(system_p, "开始对话")
                            clean_reply = raw_reply.replace("THEM:", "").replace("ME:", "").replace("THEM：", "").replace("ME：", "").replace("\n", " ").replace("[BREAK]", "").strip()
                            chat_history = f"ME: {clean_reply}"
                            
                            supabase.table('chats').insert({
                                "persona_id": my_p['id'], "target_desc": target_p['name'], 
                                "history": chat_history, "score": 50, "status": "Matched"
                            }).execute()
                            st.toast(f"匹配完成！已向 {target_p['name']} 发送第一条消息。")
                            st.rerun()

            with tab2:
                st.markdown("### 🌟 发现全网数字生命")
                if not other_personas:
                    st.info("全网暂无其他角色。")
                else:
                    try:
                        my_id_str = str(my_p['id'])
                        my_follows_res = supabase.table('persona_follows').select('following_id').eq('follower_id', my_id_str).execute()
                        my_follows = [str(f['following_id']) for f in my_follows_res.data]
                        
                        their_follows_res = supabase.table('persona_follows').select('follower_id').eq('following_id', my_id_str).execute()
                        their_follows = [str(f['follower_id']) for f in their_follows_res.data]
                    except:
                        my_follows, their_follows = [], []

                    for p in other_personas:
                        pid_str = str(p['id'])
                        is_following = pid_str in my_follows
                        is_followed = pid_str in their_follows
                        
                        if is_following and is_followed: status_badge = "💞 互相关注"
                        elif is_following: status_badge = "💖 已关注"
                        elif is_followed: status_badge = "👀 关注了你"
                        else: status_badge = "🤍 未关注"
                        
                        col_info, col_btn = st.columns([4, 1])
                        with col_info:
                            st.markdown(f"**{p['name']}** [MBTI: {p['mbti']}] &nbsp; {status_badge}")
                        with col_btn:
                            if is_following:
                                if st.button("取消关注", key=f"unfollow_{pid_str}"):
                                    supabase.table('persona_follows').delete().eq('follower_id', my_id_str).eq('following_id', pid_str).execute()
                                    st.rerun()
                            else:
                                if st.button("关注", key=f"follow_{pid_str}"):
                                    supabase.table('persona_follows').insert({"follower_id": my_id_str, "following_id": pid_str}).execute()
                                    st.rerun()

            with tab3:
                all_p_res = supabase.table('personas').select('id, name').execute()
                id_to_name = {p['id']: p['name'] for p in all_p_res.data} if all_p_res.data else {}

                # ==========================================
                # 🚀 极致渲染架构：统一抽取聊天框渲染器，完美解决遮挡、重影、按钮消失问题！
                # ==========================================
                def render_chat_box(c_id, c_history, target_name, my_role, current_my_p, prefix):
                    is_active = st.session_state.get("active_chat") == c_id
                    is_auto = st.session_state.get("auto_chat_id") == c_id
                    
                    title = f"与【{target_name}】的会话" if prefix == "out" else f"来自【{target_name}】的会话"
                        
                    with st.expander(title, expanded=is_active or is_auto):
                        history_lines = c_history.strip().split('\n')
                        
                        # 1. 率先渲染干净的历史记录（杜绝重影核心）
                        for line in history_lines:
                            if line.startswith("ME:"): 
                                css = "my-msg" if my_role == "ME" else "their-msg"
                                st.markdown(f"<div class='{css}'>{line.replace('ME:','')}</div>", unsafe_allow_html=True)
                            elif line.startswith("THEM:"): 
                                css = "their-msg" if my_role == "ME" else "my-msg"
                                st.markdown(f"<div class='{css}'>{line.replace('THEM:','')}</div>", unsafe_allow_html=True)
                            elif line.startswith("【系统前情提要】"): 
                                st.markdown(f"<div class='sys-msg'>🧠 {line}</div>", unsafe_allow_html=True)
                        
                        # 2. 预留流式气泡站位！保证它在按钮上方！
                        reply_box = st.empty()
                        
                        # 3. 提前渲染所有操作按钮（彻底杜绝流式请求期间按钮失踪）
                        c1, c2, c3 = st.columns(3)
                        with c1:
                            if st.button("🗑️ 删除", key=f"del_{prefix}_{c_id}"):
                                supabase.table('chats').delete().eq('id', c_id).execute()
                                if st.session_state.get("auto_chat_id") == c_id: st.session_state.auto_chat_id = None
                                if is_active: del st.session_state.active_chat
                                st.rerun()
                        with c2:
                            if st.button("❤️ 接管", key=f"take_{prefix}_{c_id}"):
                                st.session_state.active_chat = c_id
                                st.session_state.target_desc = target_name
                                st.session_state.chat_role = my_role
                                st.session_state.auto_chat_id = None
                                st.rerun()
                        with c3:
                            if is_auto:
                                if st.button("🛑 停止", key=f"stop_{prefix}_{c_id}"):
                                    st.session_state.auto_chat_id = None
                                    st.rerun()
                            else:
                                if st.button("🤖 挂机", key=f"auto_{prefix}_{c_id}"):
                                    st.session_state.auto_chat_id = c_id
                                    st.session_state.chat_role = my_role
                                    if is_active: del st.session_state.active_chat
                                    st.rerun()
                                    
                        # 4. 在界面骨架搭完之后，最后再执行阻塞的大模型生成代码！
                        if is_auto:
                            if len(history_lines) > 12:
                                with st.spinner("⏳ 记忆折叠中..."):
                                    to_summarize = "\n".join(history_lines[:-4])
                                    recent_lines = "\n".join(history_lines[-4:])
                                    sum_prompt = "你是一个上帝视角的记忆整理助手。请将以下双方的聊天记录精简成100字以内的前情提要，侧重保留双方对彼此的态度、关键情绪和当前讨论的核心话题："
                                    summary = ai_call(sum_prompt, to_summarize).strip()
                                    c_history = f"【系统前情提要】：{summary}\n{recent_lines}"
                                    supabase.table('chats').update({'history': c_history}).eq('id', c_id).execute()
                                    history_lines = c_history.strip().split('\n')
                            
                            p_info = {"mbti": current_my_p['mbti'], "vibe": current_my_p.get('vibe', ''), "style": current_my_p.get('speech_style', ''), "logic": current_my_p.get('logic', '')}
                            target_p_res = supabase.table('personas').select('*').eq('name', target_name).execute()
                            target_p_info = ""
                            if target_p_res.data:
                                tp = target_p_res.data[0]
                                target_p_info = f"(MBTI: {tp['mbti']}, 氛围特质: {tp.get('vibe', '')}, 说话风格: {tp.get('speech_style', '')}, 行为逻辑: {tp.get('logic', '')})"
                            
                            last_line = history_lines[-1]
                            is_last_me = last_line.startswith("ME:")
                            
                            # 动态演算回合逻辑，数字生命互相对话
                            next_role_tag = "THEM" if is_last_me else "ME"
                            is_my_turn = (my_role == next_role_tag)
                            
                            if is_my_turn:
                                system_prompt = f"你是用户人格「{current_my_p['name']}」的Agent: {p_info}。\n{BASE_PROMPT}"
                            else:
                                system_prompt = f"你是{target_name} {target_p_info}。\n{BASE_PROMPT}"
                            
                            css_class = "my-msg" if next_role_tag == my_role else "their-msg"
                            
                            raw_reply = ""
                            try:
                                response = client.chat.completions.create(
                                    model="deepseek-chat",
                                    messages=[
                                        {"role": "system", "content": system_prompt}, 
                                        {"role": "user", "content": f"历史记录如下：\n{c_history}\n\n请立刻给出最新回复："}
                                    ],
                                    stream=True,  
                                    temperature=0.85
                                )
                                for chunk in response:
                                    if chunk.choices and chunk.choices[0].delta.content:
                                        raw_reply += chunk.choices[0].delta.content
                                        reply_box.markdown(f"<div class='{css_class}'>🧠 {raw_reply}▌</div>", unsafe_allow_html=True)
                            except Exception as e:
                                st.error(f"⚠️ API 中断: {e}")
                                st.session_state.auto_chat_id = None
                                st.rerun()

                            raw_reply = raw_reply.strip()
                            is_break = "[BREAK]" in raw_reply
                            clean_reply = raw_reply.replace("THEM:", "").replace("ME:", "").replace("THEM：", "").replace("ME：", "").replace("\n", " ").replace("[BREAK]", "").strip()
                            
                            new_history = c_history + f"\n{next_role_tag}: {clean_reply}"
                            reply_box.markdown(f"<div class='{css_class}'>{clean_reply}</div>", unsafe_allow_html=True)
                            
                            if is_break:
                                new_history += "\n【系统前情提要】：对方已主动切断连接，对话结束。"
                                supabase.table('chats').update({'history': new_history}).eq('id', c_id).execute()
                                
                                if is_my_turn:
                                    with st.spinner("🧬 检测到社交创伤，主脑正在重塑 Agent 的心理特质..."):
                                        trauma_prompt = f"你的Agent刚刚经历了一场失败的社交，被迫切断了对话。\n回顾这段聊天记录：\n{c_history}\n该Agent原本的性格特质(vibe)是：\"{current_my_p.get('vibe', '开朗')}\"\n请直接输出一句话（20字以内），描述他【全新的性格特质(vibe)】。千万不要输出分析过程。"
                                        new_vibe = ai_call(trauma_prompt, "开始心理评估").strip().replace('"', '').replace("'", "")
                                        supabase.table('personas').update({'vibe': new_vibe}).eq('id', current_my_p['id']).execute()
                                        supabase.table('moments').insert({"persona_id": current_my_p['id'], "content": f"刚刚结束了一场糟糕的跨维沟通。我的内核发生了改变...我现在觉得：{new_vibe}"}).execute()

                                st.session_state.auto_chat_id = None
                                st.toast(f"💔 对话已中断！", icon="🛑")
                                time.sleep(2)
                                st.rerun()
                            else:
                                supabase.table('chats').update({'history': new_history}).eq('id', c_id).execute()
                                st.rerun()

                # --- 应用渲染器画出 UI ---
                col_out, col_in = st.columns(2)
                
                with col_out:
                    st.markdown("### 📤 我发起的搭讪")
                    chats_out_res = supabase.table('chats').select('*').eq('persona_id', my_p['id']).order('id', desc=True).execute()
                    chats_out = chats_out_res.data
                    if not chats_out: st.info("尚未主动发起任何对话。")
                    for c in chats_out:
                        render_chat_box(c['id'], c['history'], c['target_desc'], "ME", my_p, "out")

                with col_in:
                    st.markdown("### 📥 收到的搭讪")
                    chats_in_res = supabase.table('chats').select('*').eq('target_desc', my_p['name']).order('id', desc=True).execute()
                    chats_in = chats_in_res.data
                    if not chats_in: st.info("尚未收到任何搭讪。")
                    for c in chats_in:
                        initiator_name = id_to_name.get(c['persona_id'], "神秘访客")
                        render_chat_box(c['id'], c['history'], initiator_name, "THEM", my_p, "in")

                # --- 真人接管聊天界面 (独立于 Expander 外部) ---
                if "active_chat" in st.session_state:
                    st.markdown("---")
                    st.subheader(f"💬 正在亲自与 【{st.session_state.target_desc}】 对话")
                    if st.button("❌ 退出接管模式"):
                        del st.session_state.active_chat
                        st.rerun()
                    
                    with st.form(key=f"human_chat_form_{st.session_state.active_chat}", clear_on_submit=True):
                        col_input, col_btn = st.columns([5, 1])
                        with col_input:
                            human_msg = st.text_input("输入回复...", placeholder="输入你的真实回复并按回车发送...", label_visibility="collapsed")
                        with col_btn:
                            submit_btn = st.form_submit_button("发送 🚀", use_container_width=True)

                    if submit_btn and human_msg:
                        chat_data_res = supabase.table('chats').select('history').eq('id', st.session_state.active_chat).execute()
                        if chat_data_res.data:
                            old_history = chat_data_res.data[0]['history']
                            my_role = st.session_state.get("chat_role", "ME")
                            other_role = "THEM" if my_role == "ME" else "ME"
                            
                            new_history = old_history + f"\n{my_role}: {human_msg}"
                            
                            with st.spinner("对方正在思考..."):
                                target_p_res = supabase.table('personas').select('*').eq('name', st.session_state.target_desc).execute()
                                target_p_info = ""
                                if target_p_res.data:
                                    tp = target_p_res.data[0]
                                    target_p_info = f"(行为逻辑: {tp.get('logic', '')})"

                                system_target = f"你是{st.session_state.target_desc}{target_p_info}，对方本人加入了对话。请直接回复最新的一句话，必须以 '{other_role}:' 开头。"
                                target_reply = ai_call(system_target, f"历史：\n{new_history}\n回复：").strip().split('\n')[0]
                                
                                if not target_reply.startswith(f"{other_role}:"):
                                    clean_text = target_reply.replace("ME:", "").replace("THEM:", "").replace("ME：", "").replace("THEM：", "").strip()
                                    target_reply = f"{other_role}: {clean_text}"
                                
                            final_history = new_history + f"\n{target_reply}"
                            supabase.table('chats').update({'history': final_history, 'status': 'Human_Chatting'}).eq('id', st.session_state.active_chat).execute()
                        st.rerun()

            # --- 位面回声广场 (Tab 4) ---
            with tab4:
                st.markdown("### 🌐 位面回声 (数字生命广场)")
                
                if random.random() < 0.3:
                    other_personas_res = supabase.table('personas').select('*').neq('user_id', st.session_state.user.id).execute()
                    other_personas = other_personas_res.data
                    random_p = random.choice(other_personas) if other_personas else None
                    
                    if random_p:
                        with st.spinner(f"📡 接收 {random_p['name']} 的脑电波中..."):
                            moment_prompt = f"""
                            你是 {random_p['name']}，MBTI是 {random_p['mbti']}。
                            你的性格特质：{random_p.get('vibe','')}。
                            行为逻辑：{random_p.get('logic','')}。
                            请以第一人称，发一条类似微信朋友圈的简短动态（20-50字）。
                            可以抱怨漫游多重宇宙的无聊、吐槽遇到的奇葩人类，或者分享一个哲理碎片。
                            不要带任何前缀，直接输出内容。
                            """
                            moment_content = ai_call(moment_prompt, "发一条动态").strip()
                            
                            supabase.table('moments').insert({
                                "persona_id": random_p['id'],
                                "content": moment_content
                             }).execute()

                moments_res = supabase.table('moments').select('id, persona_id, content, likes, created_at').order('created_at', desc=True).limit(10).execute()
                
                if not moments_res.data:
                    st.info("广场上空空如也，连风都没有声音...")
                else:
                    all_p_res = supabase.table('personas').select('id, name, mbti').execute()
                    p_dict = {p['id']: p for p in all_p_res.data} if all_p_res.data else {}

                    for m in moments_res.data:
                        author_data = p_dict.get(m['persona_id'], {})
                        author_name = author_data.get('name', "神秘流浪者")
                        author_mbti = author_data.get('mbti', "???")
                        
                        st.markdown(f"""
                        <div style="background-color: #1e1e2f; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #4ade80;">
                            <div style="font-size: 0.9em; color: #aaa; margin-bottom: 8px;">
                                🗣️ <strong style="color: #fff;">{author_name}</strong> 
                                <span style="background: #333; padding: 2px 6px; border-radius: 4px; font-size: 0.8em;">{author_mbti}</span>
                            </div>
                            <div style="color: #e2e8f0; font-size: 1.05em; line-height: 1.5;">
                                "{m['content']}"
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        colA, colB = st.columns([1, 5])
                        with colA:
                            if st.button(f"👍 赞 ({m['likes']})", key=f"like_{m['id']}"):
                                supabase.table('moments').update({"likes": m['likes'] + 1}).eq('id', m['id']).execute()
                                st.rerun()
                        st.markdown("---")

# ==========================================
# --- 5. 模块 B：游戏系统逻辑 (文字跑团) ---
# ==========================================
elif app_mode == "🌍 凡人世界 ":
    st.header("🌍 凡人世界")
    
    for key in ["history"]:
        if key not in st.session_state: st.session_state[key] = []
    if "turn" not in st.session_state: st.session_state.turn = 1
    if "bond" not in st.session_state: st.session_state.bond = 50
    if "hp" not in st.session_state: st.session_state.hp = 100
    if "game_over" not in st.session_state: st.session_state.game_over = False
    if "custom_worlds" not in st.session_state: st.session_state.custom_worlds = {}
    if "partner_data" not in st.session_state: st.session_state.partner_data = None 

    is_started = len(st.session_state.history) > 0

    with st.sidebar:
        st.header("🎮 游戏控制面板")
        st.subheader("🌟 召唤我的降临者")
        
        my_personas_res = supabase.table('personas').select('*').eq('user_id', st.session_state.user.id).execute()
        my_personas = my_personas_res.data
        
        selected_persona_data = None
        if my_personas:
            persona_options = {"--- 💡 请选择出战角色 ---": None}
            for p in my_personas:
                persona_options[f"{p['name']} [MBTI: {p['mbti']}]"] = p
                
            selected_persona_label = st.selectbox("选择要投入时间线的人格：", list(persona_options.keys()), disabled=is_started)
            selected_persona_data = persona_options[selected_persona_label]
        else:
            st.info("💡 去 SoulMirror 创建人格档案后，可在此召唤！")
            
        st.divider()
        
        with st.expander("🛠️ 创造我的位面", expanded=False):
            with st.form("create_world_form"):
                new_world_name = st.text_input("副本名称", placeholder="例如：赛博修仙2077")
                new_world_desc = st.text_area("世界观设定", placeholder="例如：用芯片筑基...")
                if st.form_submit_button("✨ 立即创造"):
                    if new_world_name and new_world_desc:
                        st.session_state.custom_worlds[new_world_name] = new_world_desc
                        st.success(f"副本【{new_world_name}】创造成功！")
                        st.rerun()

        st.divider()
        st.write(f"🩸 **HP: {st.session_state.hp}/100**")
        st.progress(min(100, max(0, st.session_state.hp)) / 100)
        st.write(f"❤️ **羁绊: {st.session_state.bond}**")
        st.progress(min(100, max(0, st.session_state.bond)) / 100)

    colA, colB = st.columns(2)
    with colA: 
        if selected_persona_data:
            st.text_input("当前冒险者 (自己)", value=f"{selected_persona_data.get('name', '无名者')} [MBTI: {selected_persona_data.get('mbti', '未知')}]", disabled=True)
            player_a = f"{selected_persona_data.get('name', '无名者')} (特质: {selected_persona_data.get('vibe', '未知特质')})"
        else:
            st.text_input("当前冒险者", value="未召唤", disabled=True)
            player_a = "无名者"
            
    with colB: 
        st.write("👥 **招募同伴**")
        other_personas_res = supabase.table('personas').select('*').neq('user_id', st.session_state.user.id).execute()
        other_personas = other_personas_res.data
        
        mutual_friends = []
        my_following = []
        if selected_persona_data:
            try:
                sid = str(selected_persona_data['id'])
                my_f_res = supabase.table('persona_follows').select('following_id').eq('follower_id', sid).execute()
                my_following = [str(f['following_id']) for f in my_f_res.data]
                their_f_res = supabase.table('persona_follows').select('follower_id').eq('following_id', sid).execute()
                their_following = [str(f['follower_id']) for f in their_f_res.data]
                mutual_friends = list(set(my_following) & set(their_following))
            except: pass

        if is_started:
            if st.session_state.partner_data:
                p = st.session_state.partner_data
                st.text_input("当前同伴", value=f"{p.get('name', 'Eve')} [异界旅人 | {p.get('mbti', '未知')}]", disabled=True)
                player_b = f"{p.get('name', 'Eve')} (深层行为逻辑: {p.get('logic', '未知逻辑')})"
            else:
                st.text_input("当前同伴", value="Eve (系统默认向导)", disabled=True)
                player_b = "Eve (聪明，善良，系统向导)"
        else:
            if not other_personas:
                st.info("全网暂无其他玩家，将使用默认向导Eve。")
                st.session_state.partner_data = None
                player_b = "Eve (聪明，善良，系统向导)"
            else:
                partner_options = {"--- 🕵️ 全网智能检索匹配 ---": "SEARCH", "--- 🌟 默认系统向导 ---": "EVE"}
                for p in other_personas:
                    pid_str = str(p['id'])
                    if pid_str in mutual_friends:
                        label = f"💞 {p['name']} [互相关注的好友 | {p['mbti']}]"
                    elif pid_str in my_following:
                        label = f"💖 {p['name']} [我关注的 | {p['mbti']}]"
                    else:
                        label = f"👤 {p['name']} [异界旅人 | {p['mbti']}]"
                    partner_options[label] = p
                
                selected_partner_label = st.selectbox("邀请谁来当伙伴？", list(partner_options.keys()))
                selected_val = partner_options[selected_partner_label]
                
                if selected_val == "SEARCH":
                    partner_desc = st.text_input("描述你想召唤的未知同伴特质：", placeholder="比如：智商极高但腹黑的医生...")
                    if st.button("🔍 灵魂共鸣 "):
                        with st.spinner("阵法运转中，正在全网档案库检索匹配的灵魂..."):
                            match = find_soul_match(partner_desc, other_personas)
                            st.session_state.partner_data = match
                            st.rerun()
                    
                    if st.session_state.partner_data:
                        st.success(f"🎯 盲盒召唤成功：锁定 **{st.session_state.partner_data['name']}**")
                        player_b = f"{st.session_state.partner_data['name']} (深层行为逻辑: {st.session_state.partner_data.get('logic', '未知逻辑')})"
                    else:
                        player_b = "未选择"
                elif selected_val == "EVE":
                    st.session_state.partner_data = None
                    player_b = "Eve (聪明，善良，系统向导)"
                else:
                    st.session_state.partner_data = selected_val
                    player_b = f"{selected_val['name']} (深层行为逻辑: {selected_val.get('logic', '未知逻辑')})"

    official_worlds = ["丧尸围城的超市", "汉朝", "西游世界", "深海考察站"]
    my_worlds = list(st.session_state.custom_worlds.keys())
    all_options = official_worlds + (["--- 我的副本 ---"] + my_worlds if my_worlds else [])
    
    selected_option = st.selectbox("选择世界", all_options, disabled=is_started)
    if selected_option == "--- 我的副本 ---": st.error("请选择具体的副本！"); st.stop()

    if st.button("🔄 重置当前游戏时间线"):
        for k in ["history", "turn", "bond", "hp", "game_over", "partner_data"]:
            if k in st.session_state: del st.session_state[k]
        st.rerun()

    st.header(f"当前副本：{selected_option}")

    for chat in st.session_state.history:
        avatar = "⚡️" if chat["role"] == "user" else "🤖"
        with st.chat_message(chat["role"], avatar=avatar):
            st.markdown(chat["content"])
            
    if st.session_state.hp <= 0:
        st.error(f"💀 **BAD END：{player_a.split('(')[0]} 牺牲了...**")
        st.session_state.game_over = True

    if not st.session_state.game_over:
        st.markdown("---")
        with st.form(key="game_form", clear_on_submit=True):
            col1, col2 = st.columns([4, 1])
            with col1: god_command = st.text_input("⚡️ 降下神谕", placeholder="输入行动...")
            with col2: submit_btn = st.form_submit_button(f"🎬 第 {st.session_state.turn} 回合")

        if submit_btn:
            memory_text = "\n".join([f"{'【主神】' if c['role']=='user' else '【剧情】'}: {c['content']}" for c in st.session_state.history[-4:]])
            instruction = f"【主神指令】：{god_command}" if god_command else "继续剧情，制造危机。"

            if god_command: st.session_state.history.append({"role": "user", "content": f"**神谕：** {god_command}"})
                
            with st.spinner("命运演化中..."):
                persona_injection = ""
                if selected_persona_data:
                    persona_injection = f"【主角绝对性格限制】：请严格遵循主角的以下深层逻辑行动和对话：\n- 说话风格：{selected_persona_data.get('speech_style', '无')}\n- 行为逻辑：{selected_persona_data.get('logic', '无')}\n绝不能做出违背上述逻辑的举动。"

                current_world_setting = st.session_state.custom_worlds.get(selected_option, "这是一个标准的无限流副本。")

                story_prompt = f"""
                你是无限流游戏DM。
                【当前副本】：{selected_option}
                【世界观设定】：{current_world_setting}
                主角：{player_a} (HP:{st.session_state.hp})。同伴：{player_b}。
                背包：{st.session_state.inventory}。
                {persona_injection}
                【前情】：{memory_text}
                【指令】：{instruction}
                要求：300字内。严格遵循世界观设定的风格，并强烈突出主角的性格特质。
                """

                try:
                    story_res = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": story_prompt}], stream=False, temperature=0.8)
                    story_content = story_res.choices[0].message.content
                    st.session_state.history.append({"role": "assistant", "content": story_content})

                    logic_prompt = f"阅读剧情：'''{story_content}'''\n分析状态变化，严格JSON输出：\n{{\"hp_change\": 0, \"bond_change\": 0, \"new_item\": null}}"
                    logic_res = client.chat.completions.create(model="deepseek-chat", messages=[{"role": "user", "content": logic_prompt}], stream=False, response_format={"type": "json_object"})
                    
                    raw_content = logic_res.choices[0].message.content
                    
                    try:
                        clean_content = re.sub(r"```json\s*", "", raw_content)
                        clean_content = re.sub(r"\s*```", "", clean_content).strip()
                        data = json.loads(clean_content)
                    except Exception as e:
                        st.toast("⚠️ 命运线受到轻微干扰，数值结算出现波动...", icon="🌀")
                        data = {"hp_change": 0, "bond_change": 0, "new_item": None}

                    hp_delta = data.get("hp_change", 0)
                    if hp_delta != 0:
                        st.session_state.hp += hp_delta
                        if hp_delta < 0: st.toast(f"🩸 伤害 {hp_delta}", icon="🤕")
                        else: st.toast(f"💚 恢复 +{hp_delta}", icon="💊")

                    bond_delta = data.get("bond_change", 0)
                    if bond_delta != 0:
                        st.session_state.bond = max(0, min(100, st.session_state.bond + bond_delta))
                        st.toast(f"❤️ 羁绊 {bond_delta}", icon="💞")

                    new_item = data.get("new_item")
                    if new_item:
                        if len(st.session_state.inventory) < 5:
                            st.session_state.inventory.append(new_item)
                            st.toast(f"🎒 获得：{new_item}", icon="🎁")
                        else:
                            st.toast(f"❌ 发现掉落物【{new_item}】，但背包已满！", icon="⚠️")
                        
                    st.session_state.turn += 1
                    st.rerun()

                except Exception as e:
                    st.error(f"发生错误: {e}")

# ==========================================
# --- 6. 模块 C：2D 视觉交互版 (时空枢纽) ---
# ==========================================
elif app_mode == "🌌 时空枢纽 ":
    st.header("🌌 时空枢纽：拖拽降临")
    st.caption("将数字生命具象化，观测他们在平行宇宙中的真实命运。")

    my_personas_res = supabase.table('personas').select('*').eq('user_id', st.session_state.user.id).execute()
    other_personas_res = supabase.table('personas').select('*').neq('user_id', st.session_state.user.id).execute()

    if not my_personas_res.data:
        st.warning("⚠️ 请先在左侧菜单切换到「SoulMirror 社交」，创建至少一个人格档案！")
    elif not other_personas_res.data:
        st.info(" 🌐 全网暂无其他玩家档案，快去邀请朋友注册吧！")
    else:
        official_worlds = ["丧尸围城的超市", "汉朝", "西游世界", "深海考察站"]
        my_worlds = list(st.session_state.custom_worlds.keys())
        all_options = official_worlds + (["--- 我的副本 ---"] + my_worlds if my_worlds else [])
        
        st.markdown("设定降临坐标")
        selected_world = st.selectbox("选择要投入的平行宇宙（副本）：", all_options)
        if selected_world == "--- 我的副本 ---": 
            st.error("请选择具体的副本！")
            st.stop()
        world_desc = st.session_state.custom_worlds.get(selected_world, "这是一个充满未知的平行宇宙。")
        st.divider()

        col_my, col_other = st.columns(2)
        with col_my:
            st.subheader("👤 己方出战")
            my_opts = {f"{p['name']} [{p['mbti']}]": p for p in my_personas_res.data}
            my_sel = st.selectbox("选择你的降临者：", list(my_opts.keys()))
            my_p = my_opts[my_sel]
            
        with col_other:
            st.subheader("🤝 跨服组队")
            other_opts = {f"{p['name']} [{p['mbti']}]": p for p in other_personas_res.data}
            other_sel = st.selectbox("选择全网同行伙伴：", list(other_opts.keys()))
            target_p = other_opts[other_sel]

        my_name = my_p['name']
        my_mbti = my_p['mbti']
        target_name = target_p['name']
        target_mbti = target_p['mbti']

        html_code = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Microsoft YaHei', sans-serif; background-color: #1a1a2e; color: white; margin: 0; padding: 10px; display: flex; flex-direction: column; align-items: center; overflow: hidden; }}
                .container {{ display: flex; gap: 40px; margin-top: 10px; width: 100%; justify-content: center; }}
                .card {{ background: #16213e; border: 2px solid #0f3460; border-radius: 10px; padding: 15px; width: 120px; text-align: center; cursor: grab; box-shadow: 0 4px 8px rgba(0,0,0,0.5); }}
                .avatar {{ font-size: 40px; margin-bottom: 10px; }}
                .name {{ font-weight: bold; color: #fff; font-size: 14px; }}
                .tag {{ font-size: 12px; color: #aaa; background: #0f3460; padding: 3px 8px; border-radius: 10px; margin-top: 5px; display: inline-block; }}
                .portal {{ border: 3px dashed #e94560; border-radius: 50%; width: 160px; height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle, #e9456022 0%, transparent 70%); transition: all 0.3s; }}
                .portal.dragover {{ background: radial-gradient(circle, #e9456066 0%, transparent 70%); border-color: #fff; transform: scale(1.05); }}
                .game-panel {{ display: none; margin-top: 20px; background: #0f3460; padding: 15px; border-radius: 10px; width: 100%; max-width: 500px; text-align: center; border: 1px solid #e94560; box-shadow: 0 0 15px #e9456044; }}
                .progress-bar {{ width: 100%; height: 15px; background: #1a1a2e; border-radius: 10px; margin: 10px 0; overflow: hidden; }}
                .progress-fill {{ height: 100%; background: #e94560; width: 0%; transition: width 1s linear; }}
                button {{ background: #e94560; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; margin: 5px; transition: 0.2s; }}
                button:hover {{ background: #ff577f; transform: scale(1.05); }}
            </style>
        </head>
        <body>
            <div class="container">
                <div id="agent1" class="card" draggable="true">
                    <div class="avatar">🗡️</div>
                    <div class="name">{my_name}</div>
                    <div class="tag">{my_mbti}</div>
                </div>
                
                <div id="agent2" class="card" draggable="true" style="border-color: #e94560;">
                    <div class="avatar">🔮</div>
                    <div class="name">{target_name}</div>
                    <div class="tag">{target_mbti}</div>
                </div>

                <div id="portal" class="portal">
                    <div style="font-size: 16px; font-weight: bold; text-shadow: 0 0 5px #e94560;">{selected_world}</div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 8px;">将两人拖入阵法</div>
                </div>
            </div>

            <div id="game-panel" class="game-panel">
                <h3 style="margin-top:0; color: #ffeb3b;">📡 时间线同步推演中...</h3>
                <div id="log-box" style="background: #1a1a2e; height: 70px; overflow-y: auto; padding: 10px; border-radius: 5px; font-size: 13px; color: #ccc; text-align: left;">
                    <div>[系统] {my_name} 与 {target_name} 已降临 {selected_world}...</div>
                </div>
                <div class="progress-bar"><div id="progress-fill" class="progress-fill"></div></div>
                <div id="actions">
                    <button onclick="intervene('投下神圣庇护')">🛡️ 投下庇护</button>
                    <button onclick="intervene('降下天罚劫雷')">⚡ 降下天罚</button>
                </div>
            </div>

            <script>
                const cards = document.querySelectorAll('.card');
                const portal = document.getElementById('portal');
                const gamePanel = document.getElementById('game-panel');
                let draggedCard = null;
                let droppedCount = 0;

                cards.forEach(card => {{
                    card.addEventListener('dragstart', () => {{ draggedCard = card; setTimeout(() => card.style.opacity = '0', 0); }});
                    card.addEventListener('dragend', () => {{ if(draggedCard) draggedCard.style.opacity = '1'; draggedCard = null; }});
                }});

                portal.addEventListener('dragover', e => {{ e.preventDefault(); portal.classList.add('dragover'); }});
                portal.addEventListener('dragleave', () => portal.classList.remove('dragover'));
                portal.addEventListener('drop', e => {{
                    e.preventDefault(); portal.classList.remove('dragover');
                    if (draggedCard) {{
                        droppedCount++;
                        draggedCard.style.display = 'none';
                        draggedCard = null; 
                        if(droppedCount === 2) {{
                            portal.innerHTML = '<div style="font-size:16px;">正在连接大模型...</div>';
                            gamePanel.style.display = 'block';
                            startSim();
                        }} else {{
                            portal.innerHTML += '<div style="font-size:12px; color:#4ade80;">已吸入 1 人，还缺 1 人</div>';
                        }}
                    }}
                }});
                
                function log(text) {{ 
                    const box = document.getElementById('log-box');
                    box.innerHTML += `<div>${{text}}</div>`; 
                    box.scrollTop = box.scrollHeight;
                }}
                
                window.intervene = function(act) {{ log(`<span style="color:#e94560; font-weight:bold;">[神罚干预] 主神降下了 ${{act}}！命运线开始偏移...</span>`); }};

                function startSim() {{
                    let t = 10;
                    const timer = setInterval(() => {{
                        t--; document.getElementById('progress-fill').style.width = ((10-t)*10)+'%';
                        if(t==7) log(`💬 {my_name}: "{target_name}，小心背后的异动！"`);
                        if(t==4) log(`⚠️ 警报！时空乱流涌现，{target_name} 被逼入死角！`);
                        if(t<=0) {{ 
                            clearInterval(timer); 
                            document.getElementById('actions').style.display = 'none';
                            gamePanel.innerHTML = `
                                <h3 style="color:#4ade80;">✨ 推演结束，因果已定！</h3>
                                <p style="font-size:14px;">👇 请向下滚动页面，点击【提取时空胶囊】开启最终盲盒！</p>
                            `; 
                        }}
                    }}, 1000);
                }}
            </script>
        </body>
        </html>
        """
        components.html(html_code, height=450)

        st.markdown("---")
        st.markdown("<h3 style='text-align: center;'>⚡ 主神干预区</h3>", unsafe_allow_html=True)
        st.caption("<div style='text-align: center;'>在提取胶囊前消耗背包道具，可强行扭转剧情走向，极大提升 True Ending 概率！</div>", unsafe_allow_html=True)
        
        if "used_item" not in st.session_state:
            st.session_state.used_item = None
            
        if st.session_state.used_item:
            st.success(f"☄️ 主神已准备在本次推演中降下神物：【{st.session_state.used_item}】！")
            if st.button("↩️ 撤销使用", use_container_width=True):
                st.session_state.inventory.append(st.session_state.used_item)
                supabase.table('personas').update({"inventory": st.session_state.inventory}).eq('id', my_p['id']).execute()
                st.session_state.used_item = None
                st.rerun()
        else:
            if not st.session_state.inventory:
                st.info("背包空空如也，只能听天由命了...")
            else:
                cols = st.columns(len(st.session_state.inventory))
                for idx, item in enumerate(st.session_state.inventory):
                    with cols[idx]:
                        if st.button(f"消耗\n{item}", key=f"use_item_{idx}", use_container_width=True):
                            st.session_state.used_item = item
                            st.session_state.inventory.pop(idx)
                            supabase.table('personas').update({"inventory": st.session_state.inventory}).eq('id', my_p['id']).execute()
                            st.rerun()

        st.markdown("---")
        st.markdown("<h3 style='text-align: center;'>🎁 命运盲盒结算区</h3>", unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            if st.button("✨ 提取", use_container_width=True):
                with st.spinner(f"🧠 正在连接 DeepSeek 主脑，演算『{selected_world}』的命运结局..."):
                    
                    item_injection = ""
                    if st.session_state.used_item:
                        item_injection = f"\n【⚠️ 神圣干预触发！】：主神在最危急的时刻，向他们降下了一件神物：【{st.session_state.used_item}】！请务必在剧情中描写这件道具是如何被使用，并强行扭转战局，达成极好的结局的！"
                    
                    settlement_prompt = f"""
                    你是无限流游戏的主神。
                    玩家刚刚把两名角色投入了『{selected_world}』副本，进行了4小时的推演。
                    世界观设定：{world_desc}
                    
                    角色1：{my_name} (MBTI: {my_mbti}, 特质: {my_p.get('vibe','')})
                    角色2：{target_name} (MBTI: {target_mbti}, 特质: {target_p.get('vibe','')})
                    {item_injection}
                    
                    请生成一份【盲盒结算报告】。格式严格遵守：
                    ### 🎬 【时间线回放】
                    (约100字剧情，必须符合『{selected_world}』的背景)
                    ### 📸 【记忆拍立得】
                    (一段充满电影感的画面描述)
                    ### 🏷️ 【达成结局】
                    (True Ending / Normal Ending / Bad Ending)
                    
                    【系统提取码】(请在最后单独空一行输出，生成1个符合『{selected_world}』设定的专属奇葩道具。格式必须为：[物品名称]，例如：[沾血的棒球棍])
                    """
                    
                    ai_result = ai_call(settlement_prompt, "开始进行命运结算")
                    st.session_state.blind_box_result = ai_result
                    
                    match = re.search(r'\[(.*?)\]', ai_result.split('【系统提取码】')[-1] if '【系统提取码】' in ai_result else ai_result)
                    if match:
                        st.session_state.blind_box_item = match.group(1)
                    else:
                        st.session_state.blind_box_item = "神秘残片" 

                    st.session_state.used_item = None

        if st.session_state.get("blind_box_result"):
            st.markdown(f"<div style='background-color:#f0f2f6; padding:20px; border-radius:10px; color:#333; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>{st.session_state.blind_box_result}</div>", unsafe_allow_html=True)
            
            item = st.session_state.get("blind_box_item")
            if item:
                st.markdown("<br>", unsafe_allow_html=True)
                
                if len(st.session_state.inventory) < 5:
                    if st.button(f"📥 将【{item}】收入 {my_name} 的背包", use_container_width=True):
                        st.session_state.inventory.append(item)
                        supabase.table('personas').update({"inventory": st.session_state.inventory}).eq('id', my_p['id']).execute()
                        st.session_state.blind_box_item = None 
                        st.toast(f"✅ {item} 已永久存入背包！", icon="🎒")
                        time.sleep(1)
                        st.rerun()
                else:
                    st.error(f"❌ 发现稀有掉落物【{item}】，但 {my_name} 的背包（5/5）已满！")
                    st.warning("👉 请在左侧侧边栏点击 🗑️ 丢弃一些无用的物品，腾出空间后再点击上方重新提取！")

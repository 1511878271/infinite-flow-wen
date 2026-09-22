const fs = require('fs');

const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const startTag = '{iceboxOpen && (';
const startIndex = content.indexOf(startTag);

if (startIndex === -1) {
  console.log("Not found");
  process.exit(1);
}

// Find the matching closing bracket for {iceboxOpen && (
let depth = 0;
let endIndex = -1;
for (let i = startIndex; i < content.length; i++) {
  if (content[i] === '{') depth++;
  else if (content[i] === '}') {
    depth--;
    if (depth === 0) {
      endIndex = i;
      break;
    }
  }
}

if (endIndex === -1) {
  console.log("End not found");
  process.exit(1);
}

const replacement = `{iceboxOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIceboxOpen(false)}
            aria-label="关闭侧边栏"
          />
          <div className="absolute right-0 top-0 h-full w-[460px] max-w-[92vw] border-l border-white/10 bg-[#131313] shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-extrabold tracking-tight flex items-center gap-2">
                  灵魂蒸馏室
                </div>
                <div className="text-xs text-app-muted mt-1">塑造更立体的人格</div>
              </div>
              <button
                type="button"
                onClick={() => setIceboxOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-white/10 text-app-muted hover:text-app-fg transition-colors"
                aria-label="关闭"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pt-4">
              <div className="inline-flex w-full items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setIceboxTab("inbox")}
                  className={\`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors \${
                    iceboxTab === "inbox" ? "bg-[#007AFF] text-white shadow" : "text-app-muted hover:text-app-fg hover:bg-white/10"
                  }\`}
                >
                  特质蒸馏
                </button>
                <button
                  type="button"
                  onClick={() => setIceboxTab("outbox")}
                  className={\`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors \${
                    iceboxTab === "outbox" ? "bg-[#007AFF] text-white shadow" : "text-app-muted hover:text-app-fg hover:bg-white/10"
                  }\`}
                >
                  我的关注
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {iceboxTab === "inbox" ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-app-fg">MBTI 性格类型</label>
                    <input
                      type="text"
                      placeholder="例如：INTJ"
                      value={distillMbti}
                      onChange={(e) => setDistillMbti(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-sm text-app-fg outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all"
                    />
                    <div className="text-xs text-app-muted">设置MBTI有助于模型更准确地把握回复基调。</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-app-fg">自定义性格特质</label>
                    <textarea
                      rows={5}
                      placeholder="用几句话描述这个角色的性格细节、习惯用语、或者背景故事..."
                      value={distillCustomTraits}
                      onChange={(e) => setDistillCustomTraits(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-xl px-4 py-3 text-sm text-app-fg outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] transition-all resize-none"
                    />
                    <div className="text-xs text-app-muted">自由发挥，你可以把你想蒸馏到这张卡片的任何设定写在这里。</div>
                  </div>

                  <button
                    onClick={handleSaveDistill}
                    disabled={distillSaving}
                    className="w-full py-3 rounded-xl bg-[#007AFF] hover:bg-[#0066d6] disabled:bg-white/10 disabled:text-app-muted text-white font-bold transition-colors shadow-lg"
                  >
                    {distillSaving ? "保存中..." : "保存特质"}
                  </button>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="text-sm font-bold text-app-fg flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      知识库注入 (即将上线)
                    </div>
                    <div className="text-xs text-app-muted mt-2 leading-relaxed">
                      你可以上传人物小传、背景设定等文件，训练成为具有专业素养的专属 Agent 模型。
                    </div>
                    <button disabled className="mt-3 w-full py-2.5 rounded-xl border border-white/10 border-dashed text-app-muted text-sm font-medium cursor-not-allowed">
                      + 上传资料文件 (敬请期待)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {followsLoading ? (
                    <div className="text-app-muted text-sm text-center py-10">加载中...</div>
                  ) : followsList.length > 0 ? (
                    followsList.map((item: any) => {
                      const id = String(item?.id || "");
                      const toId = String(item?.to_persona_id || "");
                      const targetP = personaById.get(toId);
                      const name = targetP?.name || "未知人格";
                      return (
                        <div key={id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between hover:border-white/20 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shrink-0 text-lg">
                              {name.charAt(0) || "?"}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-app-fg text-base truncate">{name}</div>
                              <div className="text-xs text-app-muted truncate mt-1">
                                {targetP?.mbti || "暂无特质"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (targetP?.name) void startChatWithTarget(String(targetP.name));
                                setIceboxOpen(false);
                              }}
                              className="px-3 py-1.5 bg-[#007AFF]/10 text-[#8cc3ff] hover:bg-[#007AFF]/20 rounded-lg text-sm font-medium transition-colors"
                            >
                              去互动
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUnfollow(toId)}
                              className="px-3 py-1.5 border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-app-muted rounded-lg text-sm font-medium transition-colors"
                            >
                              取消关注
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/10 border-dashed bg-transparent p-8 text-center mt-10">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-app-muted"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                      </div>
                      <div className="text-app-fg font-bold">暂无关注的人格</div>
                      <div className="text-sm text-app-muted mt-2 leading-relaxed">
                        在「发现」频道遇到喜欢的人格，点击右上角的关注，即可在这里快速找到他们。
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex + 1);
fs.writeFileSync(path, content, 'utf8');
console.log("Done");

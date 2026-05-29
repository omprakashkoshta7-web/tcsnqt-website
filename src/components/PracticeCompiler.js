import React, { useState, useRef, useEffect } from "react";

const LANG_CONFIG = {
  python: { language: "python", version: "3.10.0", label: "Python 3", ext: "py" },
  javascript: { language: "javascript", version: "18.15.0", label: "JavaScript", ext: "js" },
  java: { language: "java", version: "15.0.2", label: "Java", ext: "java" },
  c: { language: "c", version: "10.2.0", label: "C", ext: "c" },
  cpp: { language: "cpp", version: "10.2.0", label: "C++", ext: "cpp" },
};

const DIFFICULTY = { easy: "text-emerald-400 bg-emerald-400/10", medium: "text-amber-400 bg-amber-400/10", hard: "text-red-400 bg-red-400/10" };

const QUESTIONS = [
  { id: 1, title: "Hello World", difficulty: "easy", tags: ["basics"], desc: "Write a program to print 'Hello, World!' to the console.", constraints: "No input needed.", sampleIn: "", sampleOut: "Hello, World!", stub: { python: 'print("Hello, World!")', javascript: 'console.log("Hello, World!");', java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}', c: '#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}' } },
  { id: 2, title: "Even or Odd", difficulty: "easy", tags: ["conditionals"], desc: "Take an integer input and print 'Even' if it is even, otherwise print 'Odd'.", constraints: "1 <= n <= 10^9", sampleIn: "5", sampleOut: "Odd", stub: { python: 'n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', javascript: 'const n = parseInt(prompt());\nif (n % 2 === 0) console.log("Even");\nelse console.log("Odd");', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    if (n % 2 == 0) System.out.println("Even");\n    else System.out.println("Odd");\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n;\n  scanf("%d", &n);\n  if (n % 2 == 0) printf("Even\\n");\n  else printf("Odd\\n");\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  cin >> n;\n  if (n % 2 == 0) cout << "Even" << endl;\n  else cout << "Odd" << endl;\n  return 0;\n}' } },
  { id: 3, title: "Sum of First N", difficulty: "easy", tags: ["loops", "math"], desc: "Take an integer N as input and print the sum of the first N natural numbers.", constraints: "1 <= N <= 10^4", sampleIn: "10", sampleOut: "55", stub: { python: 'n = int(input())\nprint(n * (n + 1) // 2)', javascript: 'const n = parseInt(prompt());\nconsole.log(n * (n + 1) / 2);', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    System.out.println(n * (n + 1) / 2);\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n;\n  scanf("%d", &n);\n  printf("%d\\n", n * (n + 1) / 2);\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  cin >> n;\n  cout << n * (n + 1) / 2 << endl;\n  return 0;\n}' } },
  { id: 4, title: "Palindrome String", difficulty: "easy", tags: ["strings"], desc: "Take a string input and print 'Yes' if it reads the same forwards and backwards, otherwise print 'No'.", constraints: "1 <= s.length <= 100", sampleIn: "madam", sampleOut: "Yes", stub: { python: 's = input().strip()\nprint("Yes" if s == s[::-1] else "No")', javascript: 'const s = prompt().trim();\nconsole.log(s === s.split("").reverse().join("") ? "Yes" : "No");', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    String rev = new StringBuilder(s).reverse().toString();\n    System.out.println(s.equals(rev) ? "Yes" : "No");\n  }\n}', c: '#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[100];\n  scanf("%s", s);\n  int len = strlen(s), ok = 1;\n  for (int i = 0; i < len / 2; i++)\n    if (s[i] != s[len-1-i]) { ok = 0; break; }\n  printf("%s\\n", ok ? "Yes" : "No");\n  return 0;\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n  string s;\n  cin >> s;\n  string r = s;\n  reverse(r.begin(), r.end());\n  cout << (s == r ? "Yes" : "No") << endl;\n  return 0;\n}' } },
  { id: 5, title: "Factorial", difficulty: "easy", tags: ["loops", "math"], desc: "Take an integer N as input and print its factorial.", constraints: "0 <= N <= 20", sampleIn: "5", sampleOut: "120", stub: { python: 'n = int(input())\nf = 1\nfor i in range(2, n + 1): f *= i\nprint(f)', javascript: 'const n = parseInt(prompt());\nlet f = 1;\nfor (let i = 2; i <= n; i++) f *= i;\nconsole.log(f);', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    long f = 1;\n    for (int i = 2; i <= n; i++) f *= i;\n    System.out.println(f);\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n; long f = 1;\n  scanf("%d", &n);\n  for (int i = 2; i <= n; i++) f *= i;\n  printf("%ld\\n", f);\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n; long long f = 1;\n  cin >> n;\n  for (int i = 2; i <= n; i++) f *= i;\n  cout << f << endl;\n  return 0;\n}' } },
  { id: 6, title: "Reverse String", difficulty: "medium", tags: ["strings"], desc: "Take a string input and print its reverse.", constraints: "1 <= s.length <= 100", sampleIn: "TCSNQT", sampleOut: "TQNSCT", stub: { python: 's = input().strip()\nprint(s[::-1])', javascript: 'console.log(prompt().trim().split("").reverse().join(""));', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    System.out.println(new StringBuilder(sc.next()).reverse());\n  }\n}', c: '#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[100];\n  scanf("%s", s);\n  for (int i = strlen(s)-1; i >= 0; i--) printf("%c", s[i]);\n  printf("\\n");\n  return 0;\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n  string s; cin >> s;\n  reverse(s.begin(), s.end());\n  cout << s << endl;\n  return 0;\n}' } },
  { id: 7, title: "Prime Check", difficulty: "medium", tags: ["math", "conditionals"], desc: "Take an integer N and print 'Prime' if it is prime, otherwise print 'Not Prime'.", constraints: "1 <= N <= 10^9", sampleIn: "17", sampleOut: "Prime", stub: { python: 'n = int(input())\nif n < 2:\n    print("Not Prime")\nelse:\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            print("Not Prime")\n            break\n    else:\n        print("Prime")', javascript: 'const n = parseInt(prompt());\nif (n < 2) console.log("Not Prime");\nelse {\n  let p = true;\n  for (let i = 2; i*i <= n; i++)\n    if (n % i === 0) { p = false; break; }\n  console.log(p ? "Prime" : "Not Prime");\n}', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    if (n < 2) { System.out.println("Not Prime"); return; }\n    boolean p = true;\n    for (int i = 2; i*i <= n; i++)\n      if (n % i == 0) { p = false; break; }\n    System.out.println(p ? "Prime" : "Not Prime");\n  }\n}', c: '#include <stdio.h>\n#include <math.h>\nint main() {\n  int n, p = 1;\n  scanf("%d", &n);\n  if (n < 2) p = 0;\n  for (int i = 2; i*i <= n; i++)\n    if (n % i == 0) { p = 0; break; }\n  printf("%s\\n", p ? "Prime" : "Not Prime");\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n; bool p = true;\n  cin >> n;\n  if (n < 2) p = false;\n  for (int i = 2; i*i <= n; i++)\n    if (n % i == 0) { p = false; break; }\n  cout << (p ? "Prime" : "Not Prime") << endl;\n  return 0;\n}' } },
  { id: 8, title: "Fibonacci Series", difficulty: "medium", tags: ["loops", "math"], desc: "Print the first N Fibonacci numbers (space-separated).", constraints: "1 <= N <= 30", sampleIn: "8", sampleOut: "0 1 1 2 3 5 8 13", stub: { python: 'n = int(input())\na, b = 0, 1\nfor i in range(n):\n    print(a, end=" " if i < n-1 else "\\n")\n    a, b = b, a+b', javascript: 'const n = parseInt(prompt());\nlet a=0,b=1,r=[];\nfor(let i=0;i<n;i++){r.push(a);[a,b]=[b,a+b];}\nconsole.log(r.join(" "));', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int a=0,b=1;\n    for(int i=0;i<n;i++){System.out.print(a+(i<n-1?" " :"\\n"));int t=a+b;a=b;b=t;}\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n,a=0,b=1;\n  scanf("%d",&n);\n  for(int i=0;i<n;i++){printf("%d%c",a,i<n-1?32:10);int t=a+b;a=b;b=t;}\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n,a=0,b=1;\n  cin>>n;\n  for(int i=0;i<n;i++){cout<<a<<(i<n-1?" ":"\\n");int t=a+b;a=b;b=t;}\n  return 0;\n}' } },
];

export default function PracticeCompiler({ isOpen, onClose, apiBase = "" }) {
  const [activeQ, setActiveQ] = useState(0);
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState(QUESTIONS[0].stub.python);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [leftWidth, setLeftWidth] = useState(40);
  const dragging = useRef(false);
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  const q = QUESTIONS[activeQ];

  const selectQuestion = (idx) => { setActiveQ(idx); setCode(QUESTIONS[idx].stub[lang]); setStdin(""); setOutput(null); setConsoleTab("testcase"); };
  const selectLang = (l) => { setLang(l); setCode(q.stub[l]); setOutput(null); };

  const runCode = async () => {
    setRunning(true); setOutput(null);
    const cfg = LANG_CONFIG[lang];
    try {
      const res = await fetch(`${apiBase}/api/compile`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language: cfg.language, version: cfg.version, files: [{ content: code }], stdin }) });
      const data = await res.json();
      if (data.run) setOutput({ stdout: data.run.stdout, stderr: data.run.stderr, code: data.run.code });
      else setOutput({ stdout: "", stderr: data.message || "Execution failed", code: 1 });
    } catch (e) { setOutput({ stdout: "", stderr: e.message, code: 1 }); }
    setRunning(false); setConsoleTab("output");
  };

  useEffect(() => {
    if (!editorRef.current || !textareaRef.current) return;
    const syncScroll = () => { editorRef.current.scrollTop = textareaRef.current.scrollTop; editorRef.current.scrollLeft = textareaRef.current.scrollLeft; };
    const ta = textareaRef.current;
    ta.addEventListener("scroll", syncScroll);
    return () => ta.removeEventListener("scroll", syncScroll);
  }, []);

  const handleMouseDown = () => { dragging.current = true; document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none"; };
  useEffect(() => {
    const handleMove = (e) => { if (!dragging.current) return; const pct = (e.clientX / window.innerWidth) * 100; setLeftWidth(Math.max(25, Math.min(60, pct))); };
    const handleUp = () => { dragging.current = false; document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    return () => { document.removeEventListener("mousemove", handleMove); document.removeEventListener("mouseup", handleUp); };
  }, []);

  const lines = code.split("\n").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="h-5 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-semibold">{q.id}. {q.title}</span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${DIFFICULTY[q.difficulty]}`}>{q.difficulty}</span>
            {q.tags.map((t) => (<span key={t} className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{t}</span>))}
            <select value={activeQ} onChange={(e) => selectQuestion(Number(e.target.value))} className="bg-gray-800 text-gray-300 text-xs border border-gray-700 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 ml-1">
              {QUESTIONS.map((qs, idx) => <option key={qs.id} value={idx}>Q{qs.id}. {qs.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={lang} onChange={(e) => selectLang(e.target.value)} className="bg-gray-800 text-gray-200 text-sm border border-gray-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-500">
            {Object.entries(LANG_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={runCode} disabled={running} className="flex items-center gap-1.5 px-5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all">
            {running ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Running...</>
            ) : (
              <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Run</>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem */}
        <div className="overflow-y-auto bg-gray-900 border-r border-gray-800" style={{ width: `${leftWidth}%` }}>
          <div className="p-5">
            <h2 className="text-lg font-bold text-white mb-2">{q.id}. {q.title}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{q.desc}</p>
            {q.constraints && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Constraints</h4>
                <p className="text-sm text-gray-400 font-mono">{q.constraints}</p>
              </div>
            )}
            <div className="space-y-3">
              {q.sampleIn && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Example 1</h4>
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-1">Input:</div>
                    <pre className="text-sm text-gray-200 font-mono">{q.sampleIn}</pre>
                    <div className="text-xs text-gray-500 mt-2 mb-1">Output:</div>
                    <pre className="text-sm text-emerald-300 font-mono">{q.sampleOut}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drag Handle */}
        <div className="w-1 bg-gray-800 hover:bg-blue-500 cursor-col-resize transition-colors shrink-0" onMouseDown={handleMouseDown} />

        {/* Right: Editor + Console */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 relative overflow-hidden bg-gray-950">
            <div className="absolute inset-0 flex">
              {/* Line numbers */}
              <div className="w-12 bg-gray-900 border-r border-gray-800 overflow-hidden select-none shrink-0 pt-4 text-right pr-2">
                {Array.from({ length: Math.max(lines, 20) }, (_, i) => (
                  <div key={i} className="text-[11px] leading-6 text-gray-600 font-mono">{i + 1}</div>
                ))}
              </div>
              {/* Code area */}
              <div className="flex-1 relative">
                <div ref={editorRef} className="absolute inset-0 overflow-hidden pointer-events-none pt-4 pl-3 pr-4">
                  <pre className="text-sm leading-6 text-gray-100 font-mono whitespace-pre">{code}</pre>
                </div>
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white font-mono text-sm leading-6 p-4 pl-3 resize-none outline-none border-none"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  style={{ tabSize: 2 }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="h-[220px] border-t border-gray-700 flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-b border-gray-800 shrink-0">
              <div className="flex gap-1">
                <button onClick={() => setConsoleTab("testcase")} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${consoleTab === "testcase" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  Testcase
                </button>
                <button onClick={() => setConsoleTab("output")} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${consoleTab === "output" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  Output
                  {output && output.code === 0 && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
                  {output && output.code !== 0 && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />}
                </button>
              </div>
              <button onClick={runCode} disabled={running} className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium rounded-md transition-all">
                {running ? "Running..." : "Run"}
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-auto bg-gray-950">
              {consoleTab === "testcase" && (
                <div className="p-3">
                  <label className="text-xs text-gray-500 font-medium block mb-1">STDIN</label>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program..."
                    className="w-full h-[120px] bg-gray-900 text-gray-200 font-mono text-sm p-3 rounded-lg border border-gray-700 outline-none focus:border-blue-500 resize-none"
                    spellCheck={false}
                  />
                </div>
              )}
              {consoleTab === "output" && (
                <div className="p-3">
                  {!output && <div className="text-sm text-gray-600 py-2">Run your code to see output</div>}
                  {output && output.stdout && (
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-1">stdout</div>
                      <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap bg-gray-900 p-3 rounded-lg border border-gray-700">{output.stdout}</pre>
                    </div>
                  )}
                  {output && output.stderr && (
                    <div className="mt-2">
                      <div className="text-xs text-red-400 font-medium mb-1">stderr</div>
                      <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap bg-gray-900 p-3 rounded-lg border border-red-900/50">{output.stderr}</pre>
                    </div>
                  )}
                  {output && !output.stdout && !output.stderr && (
                    <div className="text-sm text-gray-500 py-2">(no output, exit code: {output.code})</div>
                  )}
                  {output && output.code === 0 && output.stdout && (
                    <div className="mt-2 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                      Accepted
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

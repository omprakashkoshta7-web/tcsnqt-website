import React, { useState } from "react";

const LANG_CONFIG = {
  python: { language: "python", version: "3.10.0", label: "Python", ext: "py" },
  javascript: { language: "javascript", version: "18.15.0", label: "JavaScript", ext: "js" },
  java: { language: "java", version: "15.0.2", label: "Java", ext: "java" },
  c: { language: "c", version: "10.2.0", label: "C", ext: "c" },
  cpp: { language: "cpp", version: "10.2.0", label: "C++", ext: "cpp" },
};

const QUESTIONS = [
  {
    id: 1,
    title: "Print Hello World",
    desc: "Write a program to print 'Hello, World!' to the console.",
    sampleIn: "",
    sampleOut: "Hello, World!",
    stub: { python: 'print("Hello, World!")', javascript: 'console.log("Hello, World!");', java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}', c: '#include <stdio.h>\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}' },
  },
  {
    id: 2,
    title: "Even or Odd",
    desc: "Take an integer input and print 'Even' if it is even, otherwise print 'Odd'.",
    sampleIn: "5",
    sampleOut: "Odd",
    stub: { python: 'n = int(input())\nif n % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', javascript: 'const n = parseInt(prompt());\nif (n % 2 === 0) console.log("Even");\nelse console.log("Odd");', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    if (n % 2 == 0) System.out.println("Even");\n    else System.out.println("Odd");\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n;\n  scanf("%d", &n);\n  if (n % 2 == 0) printf("Even\\n");\n  else printf("Odd\\n");\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  cin >> n;\n  if (n % 2 == 0) cout << "Even" << endl;\n  else cout << "Odd" << endl;\n  return 0;\n}' },
  },
  {
    id: 3,
    title: "Sum of First N Numbers",
    desc: "Take an integer N as input and print the sum of the first N natural numbers.",
    sampleIn: "10",
    sampleOut: "55",
    stub: { python: 'n = int(input())\ntotal = n * (n + 1) // 2\nprint(total)', javascript: 'const n = parseInt(prompt());\nconst total = n * (n + 1) / 2;\nconsole.log(total);', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int total = n * (n + 1) / 2;\n    System.out.println(total);\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n;\n  scanf("%d", &n);\n  int total = n * (n + 1) / 2;\n  printf("%d\\n", total);\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  cin >> n;\n  int total = n * (n + 1) / 2;\n  cout << total << endl;\n  return 0;\n}' },
  },
  {
    id: 4,
    title: "Palindrome Check",
    desc: "Take a string input and print 'Palindrome' if it reads the same forwards and backwards, otherwise print 'Not Palindrome'.",
    sampleIn: "madam",
    sampleOut: "Palindrome",
    stub: { python: 's = input().strip()\nif s == s[::-1]:\n    print("Palindrome")\nelse:\n    print("Not Palindrome")', javascript: 'const s = prompt().trim();\nif (s === s.split("").reverse().join("")) console.log("Palindrome");\nelse console.log("Not Palindrome");', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    String rev = new StringBuilder(s).reverse().toString();\n    if (s.equals(rev)) System.out.println("Palindrome");\n    else System.out.println("Not Palindrome");\n  }\n}', c: '#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[100], rev[100];\n  scanf("%s", s);\n  int len = strlen(s), j = 0;\n  for (int i = len - 1; i >= 0; i--) rev[j++] = s[i];\n  rev[j] = "\\0";\n  if (strcmp(s, rev) == 0) printf("Palindrome\\n");\n  else printf("Not Palindrome\\n");\n  return 0;\n}', cpp: '#include <iostream>\n#include <algorithm>\n#include <string>\nusing namespace std;\nint main() {\n  string s, rev;\n  cin >> s;\n  rev = s;\n  reverse(rev.begin(), rev.end());\n  if (s == rev) cout << "Palindrome" << endl;\n  else cout << "Not Palindrome" << endl;\n  return 0;\n}' },
  },
  {
    id: 5,
    title: "Factorial of N",
    desc: "Take an integer N as input and print its factorial.",
    sampleIn: "5",
    sampleOut: "120",
    stub: { python: 'n = int(input())\nfact = 1\nfor i in range(2, n + 1):\n    fact *= i\nprint(fact)', javascript: 'const n = parseInt(prompt());\nlet fact = 1;\nfor (let i = 2; i <= n; i++) fact *= i;\nconsole.log(fact);', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    long fact = 1;\n    for (int i = 2; i <= n; i++) fact *= i;\n    System.out.println(fact);\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n;\n  long fact = 1;\n  scanf("%d", &n);\n  for (int i = 2; i <= n; i++) fact *= i;\n  printf("%ld\\n", fact);\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n;\n  long long fact = 1;\n  cin >> n;\n  for (int i = 2; i <= n; i++) fact *= i;\n  cout << fact << endl;\n  return 0;\n}' },
  },
  {
    id: 6,
    title: "Reverse a String",
    desc: "Take a string input and print its reverse.",
    sampleIn: "TCSNQT",
    sampleOut: "TQNSCT",
    stub: { python: 's = input().strip()\nprint(s[::-1])', javascript: 'const s = prompt().trim();\nconsole.log(s.split("").reverse().join(""));', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.next();\n    System.out.println(new StringBuilder(s).reverse());\n  }\n}', c: '#include <stdio.h>\n#include <string.h>\nint main() {\n  char s[100];\n  scanf("%s", s);\n  for (int i = strlen(s) - 1; i >= 0; i--) printf("%c", s[i]);\n  printf("\\n");\n  return 0;\n}', cpp: '#include <iostream>\n#include <algorithm>\n#include <string>\nusing namespace std;\nint main() {\n  string s;\n  cin >> s;\n  reverse(s.begin(), s.end());\n  cout << s << endl;\n  return 0;\n}' },
  },
  {
    id: 7,
    title: "Prime Number Check",
    desc: "Take an integer N as input and print 'Prime' if it is prime, otherwise print 'Not Prime'.",
    sampleIn: "17",
    sampleOut: "Prime",
    stub: { python: 'n = int(input())\nif n < 2:\n    print("Not Prime")\nelse:\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            print("Not Prime")\n            break\n    else:\n        print("Prime")', javascript: 'const n = parseInt(prompt());\nif (n < 2) console.log("Not Prime");\nelse {\n  let prime = true;\n  for (let i = 2; i * i <= n; i++) {\n    if (n % i === 0) { prime = false; break; }\n  }\n  console.log(prime ? "Prime" : "Not Prime");\n}', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    if (n < 2) { System.out.println("Not Prime"); return; }\n    boolean prime = true;\n    for (int i = 2; i * i <= n; i++) {\n      if (n % i == 0) { prime = false; break; }\n    }\n    System.out.println(prime ? "Prime" : "Not Prime");\n  }\n}', c: '#include <stdio.h>\n#include <math.h>\nint main() {\n  int n, prime = 1;\n  scanf("%d", &n);\n  if (n < 2) prime = 0;\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) { prime = 0; break; }\n  }\n  printf("%s\\n", prime ? "Prime" : "Not Prime");\n  return 0;\n}', cpp: '#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n  int n;\n  bool prime = true;\n  cin >> n;\n  if (n < 2) prime = false;\n  for (int i = 2; i * i <= n; i++) {\n    if (n % i == 0) { prime = false; break; }\n  }\n  cout << (prime ? "Prime" : "Not Prime") << endl;\n  return 0;\n}' },
  },
  {
    id: 8,
    title: "Fibonacci Series",
    desc: "Take an integer N as input and print the first N terms of the Fibonacci series (space-separated).",
    sampleIn: "8",
    sampleOut: "0 1 1 2 3 5 8 13",
    stub: { python: 'n = int(input())\na, b = 0, 1\nfor _ in range(n):\n    print(a, end=" " if _ < n - 1 else "\\n")\n    a, b = b, a + b', javascript: 'const n = parseInt(prompt());\nlet a = 0, b = 1, res = [];\nfor (let i = 0; i < n; i++) {\n  res.push(a);\n  [a, b] = [b, a + b];\n}\nconsole.log(res.join(" "));', java: 'import java.util.Scanner;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n      System.out.print(a + (i < n - 1 ? " " : "\\n"));\n      int temp = a + b;\n      a = b;\n      b = temp;\n    }\n  }\n}', c: '#include <stdio.h>\nint main() {\n  int n, a = 0, b = 1;\n  scanf("%d", &n);\n  for (int i = 0; i < n; i++) {\n    printf("%d%c", a, i < n - 1 ? " " : "\\n");\n    int temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return 0;\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  int n, a = 0, b = 1;\n  cin >> n;\n  for (int i = 0; i < n; i++) {\n    cout << a << (i < n - 1 ? " " : "\\n");\n    int temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return 0;\n}' },
  },
];

export default function PracticeCompiler({ isOpen, onClose, apiBase = "" }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(QUESTIONS[0].stub.python);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const q = QUESTIONS[activeQuestion];

  const switchQuestion = (idx) => {
    setActiveQuestion(idx);
    setCode(QUESTIONS[idx].stub[language] || "");
    setStdin("");
    setOutput(null);
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
    setCode(q.stub[lang] || "");
    setOutput(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const config = LANG_CONFIG[language];
    try {
      const res = await fetch(`${apiBase}/api/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [{ content: code }],
          stdin: stdin || "",
        }),
      });
      const data = await res.json();
      if (data.run) {
        setOutput({
          stdout: data.run.stdout,
          stderr: data.run.stderr,
          exitCode: data.run.code,
        });
      } else {
        setOutput({
          stdout: "",
          stderr: data.message || "Execution failed",
          exitCode: 1,
        });
      }
    } catch (err) {
      setOutput({ stdout: "", stderr: err.message, exitCode: 1 });
    }
    setIsRunning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-lg">&#x2328;</span> Practice Coding
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Question sidebar */}
          <div className="w-full lg:w-64 xl:w-72 bg-gray-800/30 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto shrink-0">
            <div className="p-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
              Questions
            </div>
            {QUESTIONS.map((qs, idx) => (
              <button
                key={qs.id}
                onClick={() => switchQuestion(idx)}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-700/30 transition-colors ${
                  idx === activeQuestion
                    ? "bg-blue-600/20 text-blue-300 border-l-2 border-l-blue-500"
                    : "text-gray-400 hover:bg-gray-700/30 hover:text-gray-200"
                }`}
              >
                <span className="font-mono text-xs mr-2 opacity-60">Q{qs.id}</span>
                {qs.title}
              </button>
            ))}
          </div>

          {/* Main editor area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Question description */}
            <div className="px-4 sm:px-6 py-3 bg-gray-800/20 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-blue-300">
                Q{activeQuestion + 1}: {q.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{q.desc}</p>
              {(q.sampleIn || q.sampleOut) && (
                <div className="flex gap-4 mt-2 text-xs">
                  {q.sampleIn && (
                    <div>
                      <span className="text-gray-500">Sample Input:</span>
                      <code className="ml-1.5 px-2 py-0.5 bg-gray-800 rounded text-gray-300 font-mono">
                        {q.sampleIn}
                      </code>
                    </div>
                  )}
                  {q.sampleOut && (
                    <div>
                      <span className="text-gray-500">Expected Output:</span>
                      <code className="ml-1.5 px-2 py-0.5 bg-gray-800 rounded text-green-300 font-mono">
                        {q.sampleOut}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language selector + Run */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-gray-800/40 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Language:</label>
                <select
                  value={language}
                  onChange={(e) => switchLanguage(e.target.value)}
                  className="bg-gray-800 text-gray-200 text-sm border border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {Object.entries(LANG_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isRunning ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Run Code
                  </>
                )}
              </button>
            </div>

            {/* Code editor */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-950 text-gray-100 font-mono text-sm p-4 resize-none outline-none border-none"
                spellCheck={false}
              />
            </div>

            {/* Stdin + Output */}
            <div className="border-t border-gray-700 bg-gray-800/40">
              <div className="flex">
                {/* stdin */}
                <div className="w-1/2 border-r border-gray-700 p-2">
                  <div className="text-xs text-gray-500 mb-1 font-medium">STDIN</div>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Input for your program..."
                    rows={3}
                    className="w-full bg-gray-900 text-gray-300 font-mono text-xs p-2 resize-none rounded border border-gray-700 outline-none focus:border-blue-500"
                    spellCheck={false}
                  />
                </div>
                {/* stdout */}
                <div className="w-1/2 p-2">
                  <div className="text-xs text-gray-500 mb-1 font-medium">OUTPUT</div>
                  <pre className="w-full min-h-[3rem] max-h-24 bg-gray-900 text-gray-300 font-mono text-xs p-2 rounded border border-gray-700 overflow-y-auto whitespace-pre-wrap">
                    {!output && <span className="text-gray-600">Run your code to see output</span>}
                    {output && output.stdout && <span className="text-green-300">{output.stdout}</span>}
                    {output && output.stderr && <span className="text-red-400">{output.stderr}</span>}
                    {output && !output.stdout && !output.stderr && (
                      <span className="text-gray-500">(no output, exit code: {output.exitCode})</span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

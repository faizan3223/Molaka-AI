import React, { useState, useRef } from 'react';
import {
  Code2,
  Play,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Terminal,
  Eye,
  Wand2,
  Layers,
  Bug,
  Zap,
} from 'lucide-react';
import { MokolaLogo } from './MokolaLogo';

interface CodeTemplate {
  id: string;
  name: string;
  lang: string;
  code: string;
}

const TEMPLATES: CodeTemplate[] = [
  {
    id: 'game',
    name: 'Playable Neon Dodger Game (React)',
    lang: 'react',
    code: `function DodgerGame() {
  const [playerX, setPlayerX] = React.useState(180);
  const [obstacles, setObstacles] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      setObstacles(prev => {
        const next = prev.map(o => ({ ...o, y: o.y + 5 })).filter(o => o.y < 400);
        if (Math.random() < 0.25) {
          next.push({ x: Math.floor(Math.random() * 340) + 10, y: 0, size: 24 });
        }
        return next;
      });
      setScore(s => s + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Collision check
  React.useEffect(() => {
    for (let o of obstacles) {
      if (Math.abs(o.x - playerX) < 28 && o.y > 330 && o.y < 370) {
        setGameOver(true);
      }
    }
  }, [obstacles, playerX]);

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') setPlayerX(x => Math.max(10, x - 25));
    if (e.key === 'ArrowRight') setPlayerX(x => Math.min(350, x + 25));
  };

  return (
    <div onKeyDown={handleKey} tabIndex={0} className="outline-none flex flex-col items-center justify-center p-6 bg-slate-950 text-white min-h-[420px] rounded-xl font-sans select-none">
      <div className="flex justify-between w-[380px] mb-3 text-sm">
        <span className="font-bold text-violet-400">MOKOLA DODGER</span>
        <span className="font-mono text-amber-400">Score: {score}</span>
      </div>
      <div className="relative w-[380px] h-[380px] bg-slate-900 border-2 border-violet-500/40 rounded-xl overflow-hidden shadow-2xl">
        {/* Player */}
        <div 
          style={{ left: \`\${playerX}px\`, bottom: '15px' }} 
          className="absolute w-8 h-8 bg-gradient-to-tr from-violet-500 to-amber-400 rounded-lg shadow-lg shadow-violet-500/50 flex items-center justify-center text-xs transition-all duration-75"
        >
          ▲
        </div>
        {/* Obstacles */}
        {obstacles.map((o, i) => (
          <div 
            key={i} 
            style={{ left: \`\${o.x}px\`, top: \`\${o.y}px\` }} 
            className="absolute w-6 h-6 bg-red-500 rounded-full shadow-md shadow-red-500/50"
          />
        ))}

        {/* Start / Game Over overlay */}
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-1 text-amber-400">{gameOver ? 'GAME OVER' : 'NEON DODGER'}</h2>
            <p className="text-xs text-slate-300 mb-4">{gameOver ? \`Final Score: \${score}\` : 'Use Left & Right Arrow keys to dodge falling meteorites'}</p>
            <button 
              onClick={() => { setGameStarted(true); setGameOver(false); setScore(0); setObstacles([]); }}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-amber-500 text-white font-bold rounded-lg text-xs hover:opacity-90 shadow-lg"
            >
              {gameOver ? 'Play Again' : 'Start Mission'}
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400 mt-3">Click inside game area and use ← and → arrow keys.</p>
    </div>
  );
}

export default DodgerGame;`,
  },
  {
    id: 'analytics',
    name: 'Interactive Chart & Metrics (HTML/Tailwind)',
    lang: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-slate-900 text-slate-100 p-6 font-sans">
  <div class="max-w-md mx-auto bg-slate-800/80 border border-slate-700 p-5 rounded-2xl shadow-xl">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-lg font-bold text-white">Mokola Velocity Hub</h2>
        <p class="text-xs text-slate-400">Real-time compute throughput</p>
      </div>
      <span class="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">99.98% Live</span>
    </div>
    
    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
        <span class="text-xs text-slate-400">Tokens / Sec</span>
        <div class="text-xl font-bold text-amber-400">4,280 t/s</div>
      </div>
      <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
        <span class="text-xs text-slate-400">Latency</span>
        <div class="text-xl font-bold text-violet-400">12 ms</div>
      </div>
    </div>

    <div class="h-48 relative">
      <canvas id="myChart"></canvas>
    </div>
  </div>

  <script>
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Requests (k)',
          data: [12, 19, 32, 54, 48, 62],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  </script>
</body>
</html>`,
  },
  {
    id: 'python',
    name: 'Algorithm Benchmarking (JS/Py Script)',
    lang: 'javascript',
    code: `// Mokola AI Fast High-Throughput Matrix Multiplication
function benchmark() {
  const size = 300;
  console.log(\`Benchmarking \${size}x\${size} Matrix Multiplication...\`);
  
  const A = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
  const B = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
  const C = Array.from({ length: size }, () => Array(size).fill(0));

  const t0 = performance.now();
  for (let i = 0; i < size; i++) {
    for (let k = 0; k < size; k++) {
      for (let j = 0; j < size; j++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  const t1 = performance.now();
  
  console.log(\`Done in \${(t1 - t0).toFixed(2)} ms!\`);
  console.log(\`Computed \${(size * size * size * 2 / 1e6).toFixed(1)} Million operations.\`);
}

benchmark();`,
  },
];

export function CodeStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(TEMPLATES[0]);
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [copied, setCopied] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSelectTemplate = (tmpl: CodeTemplate) => {
    setSelectedTemplate(tmpl);
    setCode(tmpl.code);
    setConsoleOutput([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedTemplate.lang === 'react' ? 'tsx' : selectedTemplate.lang === 'html' ? 'html' : 'js';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mokola_${selectedTemplate.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run the code
  const handleRun = () => {
    setConsoleOutput([]);
    if (selectedTemplate.lang === 'javascript') {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        // Evaluate safely
        const fn = new Function(code);
        fn();
        console.log = originalLog;
        setConsoleOutput(logs.length ? logs : ['Execution finished with return value: undefined']);
        setActiveTab('console');
      } catch (err: any) {
        setConsoleOutput([`Runtime Error: ${err.message}`]);
        setActiveTab('console');
      }
    } else {
      setActiveTab('preview');
      if (iframeRef.current) {
        iframeRef.current.srcdoc = buildRunnableHtml(code, selectedTemplate.lang);
      }
    }
  };

  // Ask Mokola AI to edit/refactor code
  const handleAiEdit = async (instruction: string) => {
    if (!instruction.trim() || aiLoading) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Here is existing code:\n\`\`\`${selectedTemplate.lang}\n${code}\n\`\`\`\n\nPlease fulfill this instruction: "${instruction}".\nReturn ONLY the modified complete runnable code inside a markdown code fence. Do not truncate.`,
            },
          ],
        }),
      });

      if (!res.body) throw new Error('No body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) streamText += data.text;
            } catch (e) {}
          }
        }
      }

      // Extract code block
      const match = streamText.match(/```(?:[a-zA-Z0-9_\-+]*)\s*([\s\S]*?)```/);
      if (match && match[1].trim()) {
        setCode(match[1].trim());
        setAiPrompt('');
        handleRun();
      }
    } catch (err) {
      console.error('Mokola AI code assist error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const buildRunnableHtml = (source: string, lang: string) => {
    if (lang === 'html') {
      if (source.includes('<html')) return source;
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script></head><body>${source}</body></html>`;
    }
    if (lang === 'react') {
      let clean = source
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
        .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
        .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'window.__RootComp = $1;')
        .replace(/export\s+/g, '');

      const match = source.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
      const rootComp = match ? match[1] : 'App';

      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { margin: 0; background: #0f172a; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
      ${clean}
      const Root = window.__RootComp || ${rootComp};
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root));
    } catch (e) {
      document.body.innerHTML = '<div style="color:red;padding:20px;font-family:monospace">Error: ' + e.message + '</div>';
    }
  </script>
</body>
</html>`;
    }
    return `<!DOCTYPE html><html><body><pre>${source}</pre></body></html>`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F5] dark:bg-[#161513] text-[#242424] dark:text-[#ECE8E1] overflow-hidden select-text">
      {/* Top Bar */}
      <div className="h-13 px-4 border-b border-[#E8E2D9] dark:border-[#33302B] bg-white dark:bg-[#1F1E1B] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-amber-500 flex items-center justify-center text-white">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#242424] dark:text-[#ECE8E1]">
              Mokola Code Studio
            </h2>
            <p className="text-[10px] text-[#8A857D] dark:text-[#8D8881]">
              Full-Stack Live Interactive Development & AI Synthesis
            </p>
          </div>
        </div>

        {/* Templates Picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#8A857D] dark:text-[#8D8881] hidden md:inline">Starter:</span>
          <select
            value={selectedTemplate.id}
            onChange={(e) => {
              const tmpl = TEMPLATES.find((t) => t.id === e.target.value);
              if (tmpl) handleSelectTemplate(tmpl);
            }}
            className="text-xs py-1 px-2.5 rounded-lg border border-[#E4DDD2] dark:border-[#3A3731] bg-[#FAF8F5] dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1] focus:outline-none"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-amber-600 hover:opacity-95 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded-md transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded-md transition-colors"
            title="Download File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split: Left Editor, Right Live Preview */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E8E2D9] dark:border-[#33302B] min-h-[300px]">
          {/* AI Assist Input */}
          <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#1E1D1A] border-b border-[#E8E2D9] dark:border-[#33302B] flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAiEdit(aiPrompt);
                }}
                placeholder="Ask Mokola to modify code (e.g. 'Add sound effects', 'Fix bugs', 'Add particle trails')..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#E4DDD2] dark:border-[#3A3731] bg-white dark:bg-[#282622] text-[#242424] dark:text-[#ECE8E1] placeholder:text-[#9A958E] focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
              <Sparkles className="w-3.5 h-3.5 text-violet-500 absolute left-2.5 top-2" />
            </div>
            <button
              onClick={() => handleAiEdit(aiPrompt)}
              disabled={aiLoading || !aiPrompt.trim()}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium disabled:opacity-50 transition-colors shrink-0"
            >
              {aiLoading ? 'Thinking...' : 'AI Refactor'}
            </button>
          </div>

          {/* Quick preset AI actions */}
          <div className="px-3 py-1 bg-[#F5F2EB] dark:bg-[#22201D] border-b border-[#E8E2D9] dark:border-[#33302B] flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-[#8A857D] font-medium">Quick Actions:</span>
            <button
              onClick={() => handleAiEdit('Optimize performance and clean code')}
              className="px-2 py-0.5 rounded bg-white dark:bg-[#2D2A26] border border-[#E0D9CE] dark:border-[#3D3A34] hover:text-violet-600 transition-colors"
            >
              ⚡ Optimize
            </button>
            <button
              onClick={() => handleAiEdit('Add rich visual polish, glowing neon effects, and animations')}
              className="px-2 py-0.5 rounded bg-white dark:bg-[#2D2A26] border border-[#E0D9CE] dark:border-[#3D3A34] hover:text-violet-600 transition-colors"
            >
              ✨ Visual Polish
            </button>
            <button
              onClick={() => handleAiEdit('Inspect code for bugs and fix potential runtime errors')}
              className="px-2 py-0.5 rounded bg-white dark:bg-[#2D2A26] border border-[#E0D9CE] dark:border-[#3D3A34] hover:text-violet-600 transition-colors"
            >
              🐛 Bug Fix
            </button>
          </div>

          {/* Textarea code editor */}
          <div className="flex-1 relative bg-[#1E1E1E] text-slate-100 font-mono-claude text-xs overflow-hidden flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 bg-transparent resize-none focus:outline-none leading-relaxed overflow-auto"
            />
          </div>
        </div>

        {/* Right: Live Preview & Console Output */}
        <div className="flex-1 flex flex-col min-h-[300px] bg-[#FAF8F5] dark:bg-[#191816]">
          {/* Header tabs for output */}
          <div className="h-10 px-4 border-b border-[#E8E2D9] dark:border-[#33302B] bg-white dark:bg-[#1E1D1A] flex items-center justify-between">
            <div className="flex items-center gap-1 p-0.5 bg-[#F2EDE5] dark:bg-[#2A2824] rounded-lg">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                    : 'text-[#6E6D6A] dark:text-[#A09B93]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Runner</span>
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'console'
                    ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                    : 'text-[#6E6D6A] dark:text-[#A09B93]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Output Console</span>
              </button>
            </div>
            <button
              onClick={handleRun}
              className="p-1 text-[#6E6D6A] hover:text-[#242424] dark:hover:text-[#ECE8E1] rounded transition-colors"
              title="Refresh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden p-2 sm:p-4">
            {activeTab === 'preview' ? (
              <div className="w-full h-full rounded-xl overflow-hidden border border-[#E8E2D9] dark:border-[#383530] bg-white shadow-sm">
                <iframe
                  ref={iframeRef}
                  srcDoc={buildRunnableHtml(code, selectedTemplate.lang)}
                  sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                  title="Mokola Code Runner"
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-xl overflow-auto bg-[#181818] p-4 text-xs font-mono-claude text-slate-200 border border-[#33302B]">
                <div className="text-slate-500 mb-2">// Mokola Runtime Execution Log</div>
                {consoleOutput.length === 0 ? (
                  <div className="text-slate-500">Click "Run Code" to view stdout and execution traces.</div>
                ) : (
                  consoleOutput.map((log, idx) => (
                    <div key={idx} className="text-emerald-400 py-0.5">
                      &gt; {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Artifact } from '../types';
import { buildExecutableHtml } from '../utils/artifactExtractor';
import {
  X,
  Play,
  Copy,
  Check,
  Download,
  RotateCcw,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  Code,
  Eye,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface ArtifactPanelProps {
  artifact: Artifact;
  onClose: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function ArtifactPanel({ artifact, onClose }: ArtifactPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'console'>('preview');
  const [copied, setCopied] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate runnable HTML code
  const executableHtml = buildExecutableHtml(artifact);

  // Listen to messages from the iframe console
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CLAUDE_ARTIFACT_LOG') {
        setConsoleLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${e.data.message}`]);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      html: 'html',
      react: 'tsx',
      svg: 'svg',
      javascript: 'js',
      python: 'py',
      css: 'css',
      json: 'json',
      markdown: 'md',
    };
    const ext = extensions[artifact.type] || 'txt';
    const filename = `${artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.${ext}`;
    const blob = new Blob([artifact.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Determine viewport width style
  const getViewportWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[390px] shadow-2xl rounded-2xl overflow-hidden border border-[#D5CFC5]';
    if (deviceMode === 'tablet') return 'max-w-[768px] shadow-xl rounded-xl overflow-hidden border border-[#D5CFC5]';
    return 'w-full h-full';
  };

  return (
    <aside
      className={`bg-[#FFFFFF] dark:bg-[#1C1B19] border-l border-[#E8E2D9] dark:border-[#33302B] flex flex-col z-30 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50'
          : 'w-full lg:w-[48%] xl:w-[52%] h-full shrink-0 shadow-lg'
      }`}
    >
      {/* Top Bar */}
      <div className="h-13 px-4 border-b border-[#E8E2D9] dark:border-[#33302B] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#201F1C] select-none">
        {/* Title & Type */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
          <h2 className="text-xs sm:text-sm font-semibold text-[#242424] dark:text-[#ECE8E1] truncate">
            {artifact.title}
          </h2>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F0ECE5] dark:bg-[#2C2A26] text-[#6E6D6A] dark:text-[#A09B93]">
            {artifact.language}
          </span>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center p-0.5 bg-[#EFEBE3] dark:bg-[#2A2824] rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'console'
                ? 'bg-white dark:bg-[#383530] text-[#242424] dark:text-[#ECE8E1] shadow-xs'
                : 'text-[#6E6D6A] dark:text-[#A09B93] hover:text-[#242424]'
            }`}
            title="Console logs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logs</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1">
          {activeTab === 'preview' && (
            <>
              {/* Responsive Toggles */}
              <div className="hidden sm:flex items-center gap-0.5 bg-[#EFEBE3] dark:bg-[#2A2824] p-0.5 rounded-md mr-1">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  title="Desktop View"
                  className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-white dark:bg-[#383530] text-[#C85A32]' : 'text-[#6E6D6A]'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('tablet')}
                  title="Tablet View"
                  className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-white dark:bg-[#383530] text-[#C85A32]' : 'text-[#6E6D6A]'}`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  title="Mobile View"
                  className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-white dark:bg-[#383530] text-[#C85A32]' : 'text-[#6E6D6A]'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                title="Reload Preview"
                className="p-1.5 text-[#6E6D6A] hover:text-[#242424] hover:bg-[#EAE4DC] dark:hover:bg-[#2D2A26] rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={handleCopyCode}
            title="Copy Code"
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] hover:bg-[#EAE4DC] dark:hover:bg-[#2D2A26] rounded-md transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            title="Download Artifact File"
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] hover:bg-[#EAE4DC] dark:hover:bg-[#2D2A26] rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] hover:bg-[#EAE4DC] dark:hover:bg-[#2D2A26] rounded-md transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            title="Close Artifact"
            className="p-1.5 text-[#6E6D6A] hover:text-[#242424] hover:bg-[#EAE4DC] dark:hover:bg-[#2D2A26] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-[#F5F2EB]/50 dark:bg-[#171614] overflow-hidden flex flex-col">
        {/* PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            <div className={`transition-all duration-300 h-full flex flex-col ${getViewportWidth()}`}>
              <iframe
                key={refreshKey}
                ref={iframeRef}
                srcDoc={executableHtml}
                title={artifact.title}
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups"
                className="w-full h-full border-0 bg-white rounded-lg"
              />
            </div>
          </div>
        )}

        {/* CODE TAB */}
        {activeTab === 'code' && (
          <div className="w-full h-full overflow-auto bg-[#1E1E1E] text-slate-100 p-4 font-mono-claude text-xs leading-relaxed">
            <div className="flex justify-between items-center pb-3 border-b border-[#333] mb-3 text-slate-400">
              <span>{artifact.code.split('\n').length} lines · {artifact.code.length} characters</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2C2C2C] hover:bg-[#3D3D3D] text-white rounded text-xs transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy All'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto">
              <code>{artifact.code}</code>
            </pre>
          </div>
        )}

        {/* CONSOLE TAB */}
        {activeTab === 'console' && (
          <div className="w-full h-full overflow-auto bg-[#181818] p-4 text-xs font-mono-claude text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#333] mb-3">
              <span className="text-slate-400">Live Execution Logs</span>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            {consoleLogs.length === 0 ? (
              <div className="text-slate-500 py-8 text-center">
                Artifact is running without runtime errors. Any console.log calls will show here.
              </div>
            ) : (
              <div className="space-y-1">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="text-emerald-400">
                    &gt; {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

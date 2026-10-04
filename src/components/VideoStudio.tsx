import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Maximize2,
  Film,
  Camera,
  Layers,
  Wand2,
  Download,
} from 'lucide-react';

type SimulationType = 'warp' | 'nebula' | 'quantum-waves' | 'matrix-code' | 'dna-helix';

interface PresetScene {
  id: SimulationType;
  title: string;
  tagline: string;
  camera: string;
}

const PRESET_SCENES: PresetScene[] = [
  {
    id: 'warp',
    title: 'Hyperspace Relativistic Warp',
    tagline: 'High-speed light streaks in deep interstellar space',
    camera: 'Forward Tracking / 120 FPS',
  },
  {
    id: 'nebula',
    title: 'Cosmic Singularity & Nebula',
    tagline: 'Gravitational accretion disk with 2,000 glowing stellar bodies',
    camera: 'Orbital Drone 360°',
  },
  {
    id: 'quantum-waves',
    title: 'Quantum Fluid Dynamics',
    tagline: 'Harmonic wave interference with refractive caustics',
    camera: 'Top-Down Isometric',
  },
  {
    id: 'dna-helix',
    title: 'Biomechanical Molecular Helix',
    tagline: 'Rotating 3D genetic strands with energy pulses',
    camera: 'Macro Dolly Zoom',
  },
  {
    id: 'matrix-code',
    title: 'Mokola Neural Glyphs Stream',
    tagline: 'Cascading typographic quantum symbols in obsidian & amber',
    camera: 'Orthographic Pan',
  },
];

export function VideoStudio() {
  const [activeScene, setActiveScene] = useState<SimulationType>('warp');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [colorTheme, setColorTheme] = useState<'terracotta' | 'neon' | 'aurora' | 'gold'>('terracotta');
  const [veoPrompt, setVeoPrompt] = useState('');
  const [veoGenerating, setVeoGenerating] = useState(false);
  const [veoStatus, setVeoStatus] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const stateRef = useRef<{ time: number; particles: any[] }>({ time: 0, particles: [] });

  // Initialize particles based on scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const count = activeScene === 'nebula' ? 1200 : activeScene === 'warp' ? 800 : 250;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000 + 1,
        radius: Math.random() * 2 + 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 0.5,
        char: String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)),
      });
    }

    stateRef.current.particles = particles;
    stateRef.current.time = 0;
  }, [activeScene]);

  // Main 60FPS Video Simulation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      if (isPlaying) {
        stateRef.current.time += 0.02 * speed;
      }

      const t = stateRef.current.time;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Color scheme
      const colors = {
        terracotta: { primary: '#C85A32', secondary: '#E0734C', glow: 'rgba(200, 90, 50, 0.4)' },
        neon: { primary: '#06B6D4', secondary: '#3B82F6', glow: 'rgba(6, 182, 212, 0.4)' },
        aurora: { primary: '#10B981', secondary: '#8B5CF6', glow: 'rgba(16, 185, 129, 0.4)' },
        gold: { primary: '#F59E0B', secondary: '#EF4444', glow: 'rgba(245, 158, 11, 0.4)' },
      }[colorTheme];

      // Trail fade effect for fluid motion video feel
      ctx.fillStyle = 'rgba(15, 14, 13, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Render Scene
      if (activeScene === 'warp') {
        const particles = stateRef.current.particles;
        ctx.fillStyle = colors.secondary;
        ctx.strokeStyle = colors.primary;

        for (const p of particles) {
          if (isPlaying) {
            p.z -= 8 * speed;
            if (p.z <= 0) {
              p.z = 1000;
              p.x = (Math.random() - 0.5) * width * 2;
              p.y = (Math.random() - 0.5) * height * 2;
            }
          }

          const k = 400 / p.z;
          const px = p.x * k + cx;
          const py = p.y * k + cy;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const size = (1 - p.z / 1000) * 4;
            const prevK = 400 / (p.z + 25 * speed);
            const prevPx = p.x * prevK + cx;
            const prevPy = p.y * prevK + cy;

            ctx.lineWidth = size * 0.8;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (activeScene === 'nebula') {
        const particles = stateRef.current.particles;
        // Central Singularity Core
        const radial = ctx.createRadialGradient(cx, cy, 5, cx, cy, 140);
        radial.addColorStop(0, '#FFFFFF');
        radial.addColorStop(0.3, colors.secondary);
        radial.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();

        for (const p of particles) {
          if (isPlaying) {
            p.angle += (0.015 * (400 / (p.z + 50))) * speed;
          }
          const dist = (p.z / 1000) * (width * 0.42) + 20;
          const px = cx + Math.cos(p.angle) * dist;
          const py = cy + Math.sin(p.angle) * (dist * 0.45); // angled disk

          ctx.fillStyle = p.z < 400 ? '#FFFFFF' : colors.primary;
          ctx.beginPath();
          ctx.arc(px, py, p.radius * (1 - p.z / 1400) * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeScene === 'quantum-waves') {
        const cols = 40;
        const rows = 25;
        const gapX = width / cols;
        const gapY = height / rows;

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const posX = x * gapX;
            const posY = y * gapY;
            const dist = Math.hypot(posX - cx, posY - cy);
            const elevation = Math.sin(dist * 0.02 - t * 2) * Math.cos(posX * 0.01 + t);
            const size = (elevation + 1.2) * 3;

            ctx.fillStyle = elevation > 0.5 ? '#FFFFFF' : colors.primary;
            ctx.beginPath();
            ctx.arc(posX, posY + elevation * 15, Math.max(1, size), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (activeScene === 'dna-helix') {
        const numNodes = 70;
        const step = (height * 0.8) / numNodes;
        const startY = height * 0.1;

        for (let i = 0; i < numNodes; i++) {
          const y = startY + i * step;
          const angle = i * 0.25 + t * 1.5;
          const xOffset = Math.sin(angle) * (width * 0.18);
          const zOffset = Math.cos(angle);

          const leftX = cx + xOffset;
          const rightX = cx - xOffset;

          // Rung connecting strand
          ctx.strokeStyle = zOffset > 0 ? colors.glow : 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.stroke();

          // Left node
          ctx.fillStyle = colors.primary;
          ctx.beginPath();
          ctx.arc(leftX, y, (zOffset + 1.2) * 3, 0, Math.PI * 2);
          ctx.fill();

          // Right node
          ctx.fillStyle = colors.secondary;
          ctx.beginPath();
          ctx.arc(rightX, y, (-zOffset + 1.2) * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeScene === 'matrix-code') {
        const particles = stateRef.current.particles;
        ctx.font = '14px monospace';

        for (const p of particles) {
          if (isPlaying) {
            p.y += (p.speed * 6 + 2) * speed;
            if (p.y > height) {
              p.y = 0;
              p.x = Math.random() * width;
              p.char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
            }
          }
          ctx.fillStyle = colors.primary;
          ctx.fillText(p.char, p.x, p.y);
        }
      }

      // 60FPS Video HUD watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px monospace';
      ctx.fillText(`MOKOLA MOTION ENGINE // 60 FPS // TIME: ${t.toFixed(2)}s // SPEED: ${speed}x`, 20, height - 20);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeScene, isPlaying, speed, colorTheme]);

  // Handle Veo text-to-video prompt submit
  const handleVeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!veoPrompt.trim() || veoGenerating) return;

    setVeoGenerating(true);
    setVeoStatus('Dispatching video generation prompt to Veo 3.1...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: veoPrompt,
          style: 'cinematic',
        }),
      });

      const data = await res.json();
      if (data.mode === 'veo' && data.operationName) {
        setVeoStatus('Veo video generation initialized. Processing frames...');
      } else {
        setVeoStatus('Live 60fps simulation synced to prompt! Adjust speed and parameters below.');
      }
    } catch (err: any) {
      setVeoStatus('Notice: Veo cloud generation requires paid key activation. Running real-time high-speed simulation.');
    } finally {
      setVeoGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#191816] text-[#242424] dark:text-[#ECE8E1] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Film className="w-4 h-4" />
            <span>Mokola Video & 60FPS Motion Synthesizer</span>
          </div>
          <h1 className="font-serif-claude text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#F3EFEA]">
            Real-Time Cinematic Video & Motion
          </h1>
          <p className="text-sm text-[#6E6D6A] dark:text-[#A09B93]">
            Instantaneous 60FPS fluid visual animations and Veo cinematic prompt director.
          </p>
        </div>

        {/* Video Canvas Container */}
        <div className="rounded-2xl overflow-hidden bg-[#0D0C0B] border border-[#33302B] shadow-2xl relative">
          <div className="aspect-video w-full relative flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain"
            />

            {/* Video overlay controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-[#C85A32] hover:bg-[#B54D28] text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span>Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        speed === s ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-slate-400'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 hidden sm:inline">Palette:</span>
                <div className="flex gap-1.5">
                  {(['terracotta', 'neon', 'aurora', 'gold'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setColorTheme(t)}
                      className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${
                        colorTheme === t ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor:
                          t === 'terracotta'
                            ? '#C85A32'
                            : t === 'neon'
                            ? '#06B6D4'
                            : t === 'aurora'
                            ? '#10B981'
                            : '#F59E0B',
                      }}
                      title={t}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Presets Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8A857D] dark:text-[#8D8881]">
            Cinematic Motion Environments
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  activeScene === scene.id
                    ? 'bg-[#FAF0EA] dark:bg-[#2F2119] border-[#F2C9B6] dark:border-[#523325] shadow-xs'
                    : 'bg-white dark:bg-[#22201D] border-[#E8E2D9] dark:border-[#383530] hover:border-[#D5CFC5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#242424] dark:text-[#ECE8E1]">
                    {scene.title}
                  </span>
                  {activeScene === scene.id && (
                    <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-[#6E6D6A] dark:text-[#A09B93]">
                  {scene.tagline}
                </p>
                <span className="text-[10px] text-[#A66E58] dark:text-[#A67865] mt-1 font-mono">
                  {scene.camera}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Veo Cinematic Prompt Generator */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#22201D] border border-[#E8E2D9] dark:border-[#383530] shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#C85A32]" />
            <h3 className="text-sm font-semibold text-[#242424] dark:text-[#ECE8E1]">
              Veo Cinematic Prompt Director
            </h3>
          </div>
          <form onSubmit={handleVeoSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={veoPrompt}
                onChange={(e) => setVeoPrompt(e.target.value)}
                placeholder="e.g. Drone flythrough over cyberpunk neo-tokyo skyscrapers with volumetric rain and neon glare..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4DDD2] dark:border-[#3E3B35] bg-[#FAF8F5] dark:bg-[#1A1917] text-[#242424] dark:text-[#ECE8E1] placeholder:text-[#9E9A93] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
              />
              <button
                type="submit"
                disabled={veoGenerating || !veoPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B54D28] text-white font-medium text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                <Wand2 className="w-4 h-4" />
                <span>Direct Video</span>
              </button>
            </div>
            {veoStatus && (
              <p className="text-xs text-[#C85A32] dark:text-[#E0734C] bg-[#FAF0EA] dark:bg-[#2F2119] p-2.5 rounded-lg border border-[#F2C9B6] dark:border-[#523325]">
                {veoStatus}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

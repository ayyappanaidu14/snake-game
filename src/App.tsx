import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan font-sans flex flex-col overflow-x-hidden crt-flicker">
      <div className="scanlines" />
      <div className="noise" />

      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b-4 border-magenta bg-black shrink-0 relative z-10 tear">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-mono text-white glitch-text" data-text="SYS.INIT">
            SYS.INIT
          </div>
          <div className="text-magenta font-mono text-sm hidden md:block">
            // NEURO-LINK_ESTABLISHED
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-cyan mb-1">STATUS</div>
            <div className="text-lg font-mono text-magenta animate-pulse">ONLINE</div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] p-6 gap-6 relative z-10">
        
        {/* Left Column: Terminal Output */}
        <div className="border-2 border-cyan bg-black p-4 order-2 lg:order-1 flex flex-col gap-6">
          <div className="border-b-2 border-cyan pb-2 mb-2">
            <h2 className="text-xl font-mono text-white glitch-text" data-text="TERMINAL">TERMINAL</h2>
          </div>
          <div className="text-sm space-y-2 text-cyan opacity-80">
            <p>&gt; INITIALIZING SNAKE.EXE...</p>
            <p>&gt; ALLOCATING MEMORY...</p>
            <p>&gt; BYPASSING FIREWALL...</p>
            <p className="text-magenta animate-pulse">&gt; READY.</p>
          </div>

          <div className="mt-auto border-t-2 border-cyan pt-4">
            <h2 className="text-xl font-mono text-white mb-4 glitch-text" data-text="TOP_AGENTS">TOP_AGENTS</h2>
            <div className="text-sm space-y-2 font-mono">
              {[
                { name: '0xGHOST', score: '0xFFFF' },
                { name: '0xVOID', score: '0x7FFF' },
                { name: '0xNULL', score: '0x3FFF' },
              ].map((player, i) => (
                <div key={i} className="flex justify-between border-b border-cyan/30 pb-1">
                  <span className="text-magenta">{player.name}</span>
                  <span className="text-cyan">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Game */}
        <div className="order-1 lg:order-2 flex flex-col items-center justify-center border-4 border-magenta p-2 bg-[#050505] relative">
          <div className="absolute top-0 left-0 bg-magenta text-black font-mono text-xs px-2 py-1">
            PID: 8492 // SNAKE.EXE
          </div>
          <div className="w-full max-w-[600px] mt-6">
            <SnakeGame />
          </div>
        </div>

        {/* Right Column: Audio */}
        <div className="border-2 border-cyan bg-black p-4 order-3 flex flex-col gap-6">
          <div className="border-b-2 border-cyan pb-2 mb-2">
            <h2 className="text-xl font-mono text-white glitch-text" data-text="AUDIO.SYS">AUDIO.SYS</h2>
          </div>
          <MusicPlayer />
          
          <div className="mt-auto border-t-2 border-cyan pt-4">
            <h2 className="text-xl font-mono text-white mb-4 glitch-text" data-text="UPLINK">UPLINK</h2>
            <p className="text-xs text-cyan mb-4">ESTABLISH CONNECTION TO MAINFRAME TO UPLOAD DATA.</p>
            <button className="w-full py-3 bg-black border-2 border-magenta text-magenta font-mono text-sm hover:bg-magenta hover:text-black transition-colors uppercase">
              [ CONNECT_WALLET ]
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="h-12 border-t-4 border-cyan bg-black px-6 flex items-center justify-between shrink-0 relative z-10">
        <div className="text-xs text-magenta font-mono">
          EOF // 2026
        </div>
        <div className="text-xs text-cyan font-mono animate-pulse">
          _
        </div>
      </footer>
    </div>
  );
}


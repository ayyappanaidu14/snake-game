import React, { useState, useRef, useEffect } from 'react';

interface Track {
  id: number;
  title: string;
  url: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: 1, title: "AUDIO_01.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "AUDIO_02.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "AUDIO_03.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col gap-4 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Playlist */}
      <div className="border border-cyan p-2 space-y-1">
        <div className="text-xs text-magenta mb-2 border-b border-magenta pb-1">DIR: /AUDIO/</div>
        {DUMMY_TRACKS.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`cursor-pointer text-sm flex items-center gap-2 ${
              index === currentTrackIndex ? 'bg-cyan text-black' : 'text-cyan hover:bg-cyan/20'
            }`}
          >
            <span>{index === currentTrackIndex ? '>' : ' '}</span>
            <span>{track.title}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="border border-magenta p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="text-magenta text-sm animate-pulse">
            {isPlaying ? 'PLAYING...' : 'STOPPED.'}
          </div>
          <button 
            onClick={togglePlay} 
            className="bg-black border border-magenta text-magenta px-4 py-1 hover:bg-magenta hover:text-black transition-colors"
          >
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-cyan">
            <span>BUFFER</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-4 border border-cyan p-[2px] w-full flex">
            <div 
              className="h-full bg-cyan transition-all duration-100" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

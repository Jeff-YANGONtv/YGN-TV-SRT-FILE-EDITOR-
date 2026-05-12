"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

interface VideoPlayerProps {
  videoUrl?: string;
  videoFile?: File | Blob;
  subtitles: Subtitle[];
  onTimeUpdate?: (currentTime: number) => void;
}

const timeToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseFloat(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoFile,
  subtitles,
  onTimeUpdate,
}) => {
  const [videoObjectUrl, setVideoObjectUrl] = React.useState<string | null>(null);

  // Create object URL from file if provided
  React.useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);

      // Find current subtitle
      const active = subtitles.find((sub) => {
        const startSec = timeToSeconds(sub.startTime);
        const endSec = timeToSeconds(sub.endTime);
        return time >= startSec && time < endSec;
      });
      setCurrentSubtitle(active || null);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [subtitles, onTimeUpdate]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const finalVideoUrl = videoObjectUrl || videoUrl;

  if (!finalVideoUrl) {
    return (
      <div className="w-full bg-black/50 rounded-[1.5rem] border border-white/10 p-8 text-center">
        <p className="text-slate-400 text-sm font-medium">No video provided</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {videoFile && (
        <div className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-3 py-2 rounded-lg">
          📁 {videoFile instanceof File ? videoFile.name : 'Local Video'}
        </div>
      )}
      {/* Video Container */}
      <div className="relative bg-black rounded-[1.5rem] overflow-hidden border border-white/10">
        <video
          ref={videoRef}
          src={finalVideoUrl}
          className="w-full h-auto"
          crossOrigin="anonymous"
        />

        {/* Subtitle Overlay */}
        {currentSubtitle && (
          <div className="absolute bottom-16 left-0 right-0 text-center px-4 py-2 bg-black/60 backdrop-blur-sm">
            <p className="text-white text-sm font-medium leading-relaxed">
              {currentSubtitle.text}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                }
              }}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs font-mono text-slate-300 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-lg hover:bg-white/10 transition text-blue-500"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400"
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle List Preview */}
      <div className="bg-white/[0.03] rounded-[1.5rem] border border-white/5 p-4 max-h-40 overflow-y-auto">
        <p className="text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">
          Subtitle Timeline
        </p>
        <div className="space-y-2">
          {subtitles.map((sub) => {
            const startSec = timeToSeconds(sub.startTime);
            const isActive = currentTime >= startSec && currentTime < timeToSeconds(sub.endTime);
            return (
              <div
                key={sub.id}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = startSec;
                  }
                }}
                className={`p-2 rounded-lg cursor-pointer transition text-xs font-medium ${
                  isActive
                    ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="font-mono text-[8px]">{sub.startTime}</span>
                <span className="mx-2">→</span>
                <span className="line-clamp-1">{sub.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

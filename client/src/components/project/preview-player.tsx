import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, MessageSquare } from "lucide-react";
import type { Comment } from "@shared/schema";

interface PreviewPlayerProps {
  projectId: number;
  previewUrl?: string;
  comments: Comment[];
  onTimeChange?: (time: number) => void;
}

export function PreviewPlayer({ projectId, previewUrl, comments, onTimeChange }: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentMarkers, setShowCommentMarkers] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      onTimeChange?.(video.currentTime);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [onTimeChange]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimestamp = (timestamp: string) => {
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const getCommentMarkersForTimeline = () => {
    return comments
      .filter(comment => comment.timestamp)
      .map(comment => ({
        ...comment,
        timeInSeconds: parseTimestamp(comment.timestamp!),
      }))
      .filter(comment => comment.timeInSeconds <= duration);
  };

  const jumpToComment = (timeInSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  };

  const commentMarkers = getCommentMarkersForTimeline();

  if (!previewUrl) {
    return (
      <Card className="bg-slate-100">
        <CardContent className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No preview available</h3>
            <p className="text-slate-500">Upload a preview file to display it here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={previewUrl}
          poster="/api/placeholder/800/450"
        >
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-20 transition-all"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="relative">
              <div
                ref={progressRef}
                className="w-full h-2 bg-white bg-opacity-30 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-primary rounded-full relative"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>

              {/* Comment Markers */}
              {showCommentMarkers && commentMarkers.map((comment, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-0.5 hover:scale-110 transition-transform"
                  style={{ left: `${(comment.timeInSeconds / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToComment(comment.timeInSeconds);
                  }}
                  title={`${comment.authorName}: ${comment.content} (${comment.timestamp})`}
                />
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentMarkers(!showCommentMarkers)}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Markers Legend */}
      {showCommentMarkers && commentMarkers.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Timeline Comments</h4>
              <Badge variant="secondary">{commentMarkers.length}</Badge>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {commentMarkers.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => jumpToComment(comment.timeInSeconds)}
                >
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium text-sm">{comment.authorName}</span>
                      <span className="text-yellow-400 text-xs">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-sm truncate">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

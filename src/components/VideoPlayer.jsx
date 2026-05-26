import React, { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, Lock, ExternalLink } from "lucide-react";

function parseDuration(durationStr) {
  if (!durationStr) return 300;
  const parts = String(durationStr).split(":");
  if (parts.length < 2) return 300;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url || "");
}

export default function VideoPlayer({ module, onComplete, isCompleted }) {
  const [watchedSeconds, setWatchedSeconds] = useState(isCompleted ? parseDuration(module.duration) : 0);
  const [markedComplete, setMarkedComplete] = useState(isCompleted);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  const requiredSeconds = parseDuration(module.duration);
  const youtubeId = getYouTubeId(module.videoUrl);
  const directVideo = isDirectVideo(module.videoUrl);
  const hasEmbed = Boolean(youtubeId || directVideo);
  const watchPercent = Math.min(100, Math.round((watchedSeconds / requiredSeconds) * 100));
  const canComplete = isCompleted || markedComplete || watchedSeconds >= requiredSeconds * 0.9;

  useEffect(() => {
    setWatchedSeconds(isCompleted ? requiredSeconds : 0);
    setMarkedComplete(isCompleted);
  }, [module.id, isCompleted, requiredSeconds]);

  const handleComplete = useCallback(() => {
    if (!markedComplete && !isCompleted) {
      setMarkedComplete(true);
      onComplete();
    }
  }, [markedComplete, isCompleted, onComplete]);

  // YouTube IFrame API
  useEffect(() => {
    if (!youtubeId || isCompleted) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    const initPlayer = () => {
      if (!iframeRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: youtubeId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              timerRef.current = setInterval(() => {
                const t = playerRef.current?.getCurrentTime?.() ?? 0;
                setWatchedSeconds((prev) => Math.max(prev, Math.floor(t)));
              }, 1000);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              clearInterval(timerRef.current);
              setWatchedSeconds(requiredSeconds);
              handleComplete();
            } else {
              clearInterval(timerRef.current);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      clearInterval(timerRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [youtubeId, isCompleted, requiredSeconds, handleComplete]);

  // Direct video progress
  const onVideoTimeUpdate = (e) => {
    const t = Math.floor(e.target.currentTime);
    setWatchedSeconds((prev) => Math.max(prev, t));
    if (t >= requiredSeconds * 0.95) handleComplete();
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            {module.title}
            {isCompleted && <CheckCircle2 className="text-success w-5 h-5" />}
          </h3>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl leading-relaxed">{module.description}</p>
        </div>
        {!isCompleted && (
          <span className="badge badge-video text-[10px]">
            {watchPercent}% watched
          </span>
        )}
      </div>

      <div className="video-wrapper">
        {youtubeId ? (
          <div ref={iframeRef} id={`yt-${module.id}`} className="w-full h-full" />
        ) : directVideo ? (
          <video
            src={module.videoUrl}
            controls
            className="w-full h-full"
            onTimeUpdate={onVideoTimeUpdate}
            onEnded={handleComplete}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-navy-dark">
            <p className="text-orange font-display font-bold text-lg mb-2">Video coming soon</p>
            <p className="text-text-secondary text-sm max-w-md">
              Your training video will appear here once it is added in Content Studio.
              Paste a YouTube embed link or upload an .mp4 URL.
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!isCompleted && hasEmbed && (
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-navy-light rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-blue transition-all duration-300"
              style={{ width: `${watchPercent}%` }}
            />
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-orange" />
            Watch at least 90% of this module to unlock the next step.
          </p>
        </div>
      )}

      {!isCompleted && canComplete && !markedComplete && (
        <button type="button" onClick={handleComplete} className="btn btn-primary text-sm">
          Mark module complete
        </button>
      )}

      {module.videoUrl && !youtubeId && !directVideo && (
        <a
          href={module.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline text-xs inline-flex"
        >
          Open video link <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}

      {module.extraContent && (
        <ModuleExtras extra={module.extraContent} />
      )}
    </div>
  );
}

function ModuleExtras({ extra }) {
  return (
    <div className="glass-card p-4 border-l-4 border-l-sky-blue space-y-4">
      {extra.equipmentList && (
        <div>
          <h4 className="font-display font-bold text-sm uppercase text-sky-blue mb-2">Equipment spotlight</h4>
          <ul className="text-sm space-y-2">
            {extra.equipmentList.map((eq, i) => (
              <li key={i}>
                <strong className="text-white">{eq.name}</strong>
                <span className="text-text-secondary"> — {eq.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {extra.steps && (
        <div>
          <h4 className="font-display font-bold text-sm uppercase text-sky-blue mb-2">SOP workflow</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-text-secondary">
            {extra.steps.map((st, i) => (
              <li key={i}>
                <strong className="text-white">{st.step}</strong>: {st.detail}
              </li>
            ))}
          </ol>
        </div>
      )}
      {extra.hazards && (
        <div>
          <h4 className="font-display font-bold text-sm uppercase text-orange mb-2">Safety corrections</h4>
          <ul className="text-sm space-y-2">
            {extra.hazards.map((hz, i) => (
              <li key={i} className="text-text-secondary">
                <strong className="text-error">{hz.hazard}</strong>: {hz.correction}
              </li>
            ))}
          </ul>
        </div>
      )}
      {extra.tips && (
        <div>
          <h4 className="font-display font-bold text-sm uppercase text-orange mb-2">1099 tips</h4>
          <ul className="text-sm space-y-2">
            {extra.tips.map((tp, i) => (
              <li key={i} className="text-text-secondary">
                <strong className="text-white">{tp.title}</strong> — {tp.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      {extra.scriptStages && (
        <div>
          <h4 className="font-display font-bold text-sm uppercase text-sky-blue mb-2">Sales script</h4>
          <div className="space-y-2">
            {extra.scriptStages.map((sc, i) => (
              <div key={i} className="text-xs bg-navy-dark p-3 rounded-lg border border-navy-border/50">
                <strong className="text-orange uppercase text-[10px] block mb-1">{sc.stage}</strong>
                <span className="italic text-text-primary">&ldquo;{sc.detail}&rdquo;</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import type { HeroClip } from '@/data/hero';
import { prefersReducedMotion } from '@/lib/motion';

// Media URLs are not fingerprinted. Bump this whenever the encoded films
// change so returning visitors do not keep the previous, larger files from
// the one-week media cache.
const MEDIA_VERSION = '2';

/**
 * All four journey films live in the stage so GSAP can choreograph their
 * entrances and exits against the globe timeline. Only the active film is
 * allowed to load or play; the others stay paused on their posters.
 */
export const JourneyFilm = ({ clip, active }: { clip: HeroClip; active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false,
  );
  const [reduced, setReduced] = useState(() => prefersReducedMotion());
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [optedIn, setOptedIn] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setMobile(media.matches);
      setReduced(motion.matches);
    };
    media.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active || (reduced && !optedIn)) {
      video.pause();
      return;
    }
    video.preload = 'auto';
    const play = video.play();
    if (play) {
      play.catch(() => {
        if (active) setBlocked(true);
      });
    }
    return () => video.pause();
  }, [active, mobile, reduced, optedIn]);

  const playFilm = () => {
    const video = videoRef.current;
    if (!video) return;
    setBlocked(false);
    setOptedIn(true);
    const play = video.play();
    if (play) play.catch(() => setBlocked(true));
  };

  // The film is decorative, but the control is not: browsers that block
  // muted autoplay and visitors who request reduced motion can still opt in.
  const showPlay = active && !playing && (reduced || blocked || optedIn);

  return (
    <figure className={`journey-film journey-film--${clip.file}`} data-film={clip.file}>
      <div className="journey-film__frame">
        <video
          key={`${clip.id}-${mobile ? 'mobile' : 'desktop'}`}
          ref={videoRef}
          src={`/media/hero/${clip.file}${mobile ? '-mobile' : ''}.mp4?v=${MEDIA_VERSION}`}
          // Do not fetch all four posters on first paint. The poster belongs
          // to the chapter that is actually on screen.
          poster={active ? clip.poster : undefined}
          preload={active && !reduced ? 'auto' : 'none'}
          muted
          loop
          playsInline
          aria-hidden="true"
          onPlay={() => {
            setPlaying(true);
            setBlocked(false);
          }}
          onPause={() => setPlaying(false)}
        />
        {showPlay ? (
          <button
            type="button"
            className="journey-film__play"
            onClick={playFilm}
            aria-label={`Play the ${clip.place} film`}
          >
            <Play aria-hidden="true" />
            <span>Play film</span>
          </button>
        ) : null}
        <span className="journey-film__edge" aria-hidden="true" />
      </div>
      <figcaption className="journey-film__caption">
        <div>
          <p className="journey-film__place">
            Film · {clip.place}, {clip.country}
          </p>
          <p className="journey-film__line">{clip.caption}</p>
        </div>
        <p className="journey-film__credit">{clip.creator} / Pexels</p>
      </figcaption>
    </figure>
  );
};

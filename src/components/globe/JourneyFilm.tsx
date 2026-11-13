import { useEffect, useRef, useState } from 'react';
import type { HeroClip } from '@/data/hero';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * All four journey films live in the stage so GSAP can choreograph their
 * entrances and exits against the globe timeline. Only the active film is
 * allowed to load or play; the others stay paused on their posters.
 */
export const JourneyFilm = ({ clip, active }: { clip: HeroClip; active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  );
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
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
    if (!active || reduced) {
      video.pause();
      return;
    }
    video.preload = 'auto';
    const play = video.play();
    if (play) play.catch(() => undefined);
    return () => video.pause();
  }, [active, mobile, reduced]);

  return (
    <figure className={`journey-film journey-film--${clip.file}`} data-film={clip.file}>
      <div className="journey-film__frame">
        <video
          key={`${clip.id}-${mobile ? 'mobile' : 'desktop'}`}
          ref={videoRef}
          src={`/media/hero/${clip.file}${mobile ? '-mobile' : ''}.mp4`}
          poster={clip.poster}
          preload={active && !reduced ? 'auto' : 'none'}
          muted
          loop
          playsInline
          aria-hidden="true"
        />
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

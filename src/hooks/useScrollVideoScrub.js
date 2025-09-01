import { useFrame } from "@react-three/fiber";

/**
 * Syncs a video texture's currentTime with scroll progress
 * @param {HTMLVideoElement} videoRef - video element from useVideoTexture
 * @param {number} scrollOffset - scroll offset from useScroll
 * @param {number[]} range - [start, end] scroll range
 */
export function useScrollVideoScrub(videoRef, scrollOffset, range) {
  useFrame(() => {
    if (!videoRef || videoRef.readyState < 2 || !videoRef.duration) return;

    const [start, end] = range;
    const progress = Math.min(Math.max((scrollOffset - start) / (end - start), 0), 1);

    videoRef.currentTime = videoRef.duration * progress;
  });
}

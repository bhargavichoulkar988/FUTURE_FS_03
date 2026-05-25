// ============================================================
// Elite Dine - useScrollAnimation Hook
// Triggers animations when elements enter the viewport
// ============================================================
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that returns whether an element is visible in the viewport.
 * Use this to trigger animations when the user scrolls to a section.
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - How much of the element must be visible (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.triggerOnce - Only trigger the animation once
 * @returns {{ ref, isVisible }} - Ref to attach to element, and visibility state
 *
 * Usage:
 *   const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
 *   <div ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>...</div>
 */
const useScrollAnimation = ({
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
} = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create an IntersectionObserver to watch when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // If triggerOnce is true, stop observing after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // Reset visibility when element leaves viewport (for repeat animations)
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    // Cleanup: stop observing when component unmounts
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

export default useScrollAnimation;

import { useCallback, useEffect, useState, RefObject } from 'react';

const SCROLL_THRESHOLD = 100;

export function useScrollToBottom(containerRef: RefObject<HTMLElement>) {
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [containerRef]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
      setIsNearBottom(distanceFromBottom < SCROLL_THRESHOLD);
    }
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [containerRef, handleScroll]);

  return { scrollToBottom, isNearBottom };
}
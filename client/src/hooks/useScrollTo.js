import { useCallback } from 'react';

const useScrollTo = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToElement = useCallback((elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToPosition = useCallback((y, x = 0) => {
    window.scrollTo({
      top: y,
      left: x,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToTop,
    scrollToElement,
    scrollToPosition
  };
};

export default useScrollTo; 
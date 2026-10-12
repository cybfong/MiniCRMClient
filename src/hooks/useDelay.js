import { useState, useCallback } from 'react';

export function useDelay(ms = 2000) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoader = useCallback(() => {
    setIsLoading(true);

    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }, [ms]);

  const stopLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { isLoading, startLoader, stopLoader };
}

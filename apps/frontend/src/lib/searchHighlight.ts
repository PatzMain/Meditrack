import { useEffect, useState } from 'react';

export interface SearchHighlightHook {
  highlightId: string | null;
  isHighlighted: (id: string) => boolean;
  getHighlightStyle: (id: string) => string;
}

export const useSearchHighlight = (): SearchHighlightHook => {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const checkForHighlight = () => {
      const searchHighlight = localStorage.getItem('searchHighlight');
      const searchTimestamp = localStorage.getItem('searchTimestamp');
      
      if (searchHighlight && searchTimestamp) {
        const timestamp = parseInt(searchTimestamp);
        const age = Date.now() - timestamp;
        
        // Clear highlight if it's older than 5 seconds
        if (age > 5000) {
          localStorage.removeItem('searchHighlight');
          localStorage.removeItem('searchTimestamp');
          setHighlightId(null);
        } else {
          setHighlightId(searchHighlight);
          
          // Clear highlight after 5 seconds
          setTimeout(() => {
            setHighlightId(null);
            localStorage.removeItem('searchHighlight');
            localStorage.removeItem('searchTimestamp');
          }, 5000 - age);
        }
      }
    };

    // Check immediately
    checkForHighlight();

    // Listen for custom search highlight events
    const handleSearchHighlight = (event: CustomEvent) => {
      setHighlightId(event.detail);
      
      // Clear after 5 seconds
      setTimeout(() => {
        setHighlightId(null);
      }, 5000);
    };

    window.addEventListener('searchHighlight', handleSearchHighlight as EventListener);

    return () => {
      window.removeEventListener('searchHighlight', handleSearchHighlight as EventListener);
    };
  }, []);

  const isHighlighted = (id: string): boolean => {
    return highlightId === id || highlightId === `medical-${id}` || highlightId === `dental-${id}`;
  };

  const getHighlightStyle = (id: string): string => {
    if (isHighlighted(id)) {
      return 'bg-yellow-100 border-yellow-300 shadow-lg ring-2 ring-yellow-400 animate-pulse';
    }
    return '';
  };

  return {
    highlightId,
    isHighlighted,
    getHighlightStyle
  };
};

export const scrollToHighlightedElement = (highlightId: string) => {
  setTimeout(() => {
    const element = document.querySelector(`[data-id="${highlightId}"]`) || 
                   document.querySelector(`[data-search-id="${highlightId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  }, 100);
};
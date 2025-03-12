export class MemoryManager {
  private static instance: MemoryManager;
  private memoryLimit: number;
  private warningThreshold: number = 0.8; // 80% of memory limit
  private criticalThreshold: number = 0.9; // 90% of memory limit
  private gcTimeout: NodeJS.Timeout | null = null;

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  initialize(): void {
    this.setupMemoryMonitoring();
    this.setupLeakDetection();
    this.startPeriodicCleanup();
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryLimit = memory.jsHeapSizeLimit;

      setInterval(() => {
        const usage = memory.usedJSHeapSize / this.memoryLimit;
        
        if (usage > this.criticalThreshold) {
          this.handleCriticalMemory();
        } else if (usage > this.warningThreshold) {
          this.handleWarningMemory();
        }
      }, 1000);
    }
  }

  private handleCriticalMemory(): void {
    // Clear all non-essential caches
    this.clearCaches();
    
    // Force garbage collection if possible
    if (global.gc) {
      global.gc();
    }

    // Clear large objects
    this.clearLargeObjects();

    // Notify the user if needed
    this.notifyMemoryIssue();
  }

  private handleWarningMemory(): void {
    // Clear some caches
    this.clearOldCaches();
    
    // Schedule cleanup
    this.scheduleCleanup();
  }

  private clearCaches(): void {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (!name.includes('critical')) {
            caches.delete(name);
          }
        });
      });
    }

    // Clear memory cache
    this.clearMemoryCache();
  }

  private clearMemoryCache(): void {
    // Clear image cache
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!this.isInViewport(image)) {
        image.src = '';
      }
    }

    // Clear other caches
    localStorage.clear();
    sessionStorage.clear();
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  private setupLeakDetection(): void {
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    
    // Track intervals
    const intervals = new Set();
    window.setInterval = function(...args) {
      const id = originalSetInterval.apply(this, args);
      intervals.add(id);
      return id;
    };

    // Clear old intervals
    setInterval(() => {
      intervals.forEach(id => {
        if (!document.querySelector(`[data-interval="${id}"]`)) {
          clearInterval(id as number);
          intervals.delete(id);
        }
      });
    }, 60000);
  }
}
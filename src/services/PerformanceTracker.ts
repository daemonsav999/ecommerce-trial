import { analytics } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetric[] = [];
  private perfObserver: PerformanceObserver;

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  initialize(): void {
    // Track Core Web Vitals
    this.trackWebVitals();
    
    // Track Frame Rate
    this.trackFrameRate();
    
    // Track Memory Usage
    this.trackMemory();

    // Track Network Requests
    this.trackNetworkRequests();
  }

  private trackWebVitals(): void {
    this.perfObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.value > this.getThreshold(entry.name)) {
          this.optimizeForMetric(entry.name);
        }
        this.logMetric(entry.name, entry.value);
      });
    });

    this.perfObserver.observe({ entryTypes: ['web-vitals'] });
  }

  private trackFrameRate(): void {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime > 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.logMetric('fps', fps);
        
        if (fps < 55) { // Target 60fps
          this.optimizeRendering();
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private optimizeRendering(): void {
    // Disable animations temporarily
    document.body.classList.add('reduce-motion');
    
    // Debounce non-critical updates
    window.requestIdleCallback(() => {
      document.body.classList.remove('reduce-motion');
    });
  }

  private trackMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usage > 0.7) { // 70% memory usage
          this.clearNonEssentialCache();
        }
        
        this.logMetric('memory-usage', usage);
      }, 5000);
    }
  }

  private trackNetworkRequests(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 500) { // Slow request threshold
          this.optimizeRequest(entry.name);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private optimizeRequest(url: string): void {
    // Implement request caching
    if (this.shouldCache(url)) {
      this.cacheResponse(url);
    }

    // Implement preloading for frequently accessed resources
    if (this.isFrequentlyAccessed(url)) {
      this.preloadResource(url);
    }
  }

  private async preloadResource(url: string): Promise<void> {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = this.getResourceType(url);
    document.head.appendChild(link);
  }

  private clearNonEssentialCache(): void {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('non-essential')) {
            caches.delete(name);
          }
        });
      });
    }
  }

  private logMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    analytics.track('performance_metric', {
      metric: name,
      value,
      timestamp: Date.now()
    });
  }
}

export const performanceTracker = PerformanceTracker.getInstance();
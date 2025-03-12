import { analytics } from './analytics';

interface PerformanceMetrics {
  timeToFirstByte: number;
  firstContentfulPaint: number;
  timeToInteractive: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observer: PerformanceObserver | null = null;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  initialize(): void {
    // Monitor Core Web Vitals
    this.observeCoreWebVitals();
    // Monitor Network Requests
    this.observeNetworkRequests();
    // Monitor Long Tasks
    this.observeLongTasks();
    // Monitor Memory Usage
    this.monitorMemoryUsage();
  }

  private observeCoreWebVitals(): void {
    this.observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        analytics.track('web_vital', {
          name: entry.name,
          value: entry.value,
          rating: entry.rating,
        });
      });
    });

    this.observer.observe({ entryTypes: ['web-vitals'] });
  }

  private observeNetworkRequests(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // Slow requests (>1s)
          analytics.track('slow_request', {
            url: entry.name,
            duration: entry.duration,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private observeLongTasks(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks blocking main thread >50ms
          analytics.track('long_task', {
            duration: entry.duration,
            location: entry.name,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.handleMemoryWarning();
        }
      }, 10000);
    }
  }

  private handleMemoryWarning(): void {
    // Clear unnecessary caches
    this.clearImageCache();
    this.clearStateCache();
    
    // Force garbage collection if possible
    if (global.gc) {
      global.gc();
    }
  }
}
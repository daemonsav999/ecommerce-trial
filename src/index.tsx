import { performanceTracker } from './services/PerformanceTracker';
import { resourceLoader } from './services/ResourceLoader';
import { frameOptimizer } from './services/FrameOptimizer';
import { networkOptimizer } from './services/NetworkOptimizer';
import { AggressiveOptimizer } from './services/AggressiveOptimizer';
import { MemoryManager } from './services/MemoryManager';
import { RenderOptimizer } from './services/RenderOptimizer';

// Initialize all performance optimizers
performanceTracker.initialize();
resourceLoader.initialize();
frameOptimizer.initialize();
networkOptimizer.initialize();
AggressiveOptimizer.getInstance().initialize();
MemoryManager.getInstance().initialize();
RenderOptimizer.getInstance().initialize();

// Add performance CSS classes
document.documentElement.classList.add('optimize-performance');

// Setup performance monitoring
const startTime = performance.now();

// Add event listener for page visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.body.classList.add('reduce-animations');
    // Pause non-critical operations
    networkOptimizer.pauseNonEssentialRequests();
  } else {
    document.body.classList.remove('reduce-animations');
    // Resume operations
    networkOptimizer.retryFailedRequests();
  }
});

// Optimize initial load
window.addEventListener('load', () => {
  // Measure and report initial load performance
  const loadTime = performance.now() - startTime;
  performanceTracker.logMetric('initial-load', loadTime);

  // Remove non-critical styles
  document.querySelectorAll('link[rel="stylesheet"]')
    .forEach(link => {
      if (link.getAttribute('href')?.includes('non-critical')) {
        link.setAttribute('media', 'print');
        requestIdleCallback(() => {
          link.setAttribute('media', 'all');
        });
      }
    });

  // Initialize deferred optimizations
  requestIdleCallback(() => {
    // Preload critical resources for common user paths
    resourceLoader.preloadCriticalResources();
    
    // Setup performance observers
    performanceTracker.setupPerformanceObservers();
    
    // Initialize memory management
    MemoryManager.getInstance().startPeriodicCleanup();
  });
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
  performanceTracker.logError(event);
  // Prevent error from breaking the app
  event.preventDefault();
});

// Monitor network status
window.addEventListener('online', () => {
  networkOptimizer.retryFailedRequests();
  document.body.classList.remove('offline-mode');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline-mode');
});

// Setup progressive enhancement
if ('connection' in navigator) {
  const connection = (navigator as any).connection;
  if (connection.saveData) {
    document.body.classList.add('save-data');
  }
  
  if (connection.effectiveType === '4g') {
    document.body.classList.add('high-performance');
  } else {
    document.body.classList.add('low-performance');
  }
}

// Setup intersection observer for lazy loading
const lazyLoadObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        if (element.dataset.src) {
          resourceLoader.loadResource(element.dataset.src, {
            priority: 'low',
            preload: false
          });
        }
      }
    });
  },
  {
    rootMargin: '50px',
    threshold: 0.1
  }
);

document.querySelectorAll('[data-src]').forEach(element => {
  lazyLoadObserver.observe(element);
});

// Clean up on page unload
window.addEventListener('unload', () => {
  performanceTracker.saveMetrics();
  MemoryManager.getInstance().clearNonEssentialCache();
});

// Add support for back/forward cache
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from back/forward cache
    networkOptimizer.validateCache();
    performanceTracker.resetMetrics();
  }
});

// Monitor long tasks
new PerformanceObserver((entryList) => {
  entryList.getEntries().forEach((entry) => {
    if (entry.duration > 50) { // Tasks longer than 50ms
      performanceTracker.logLongTask(entry);
    }
  });
}).observe({ entryTypes: ['longtask'] });
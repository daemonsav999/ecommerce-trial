export class NetworkOptimizer {
  private static instance: NetworkOptimizer;
  private connectionType: string = '4g';
  private networkQueue: Map<string, Promise<any>> = new Map();
  private prefetchedResources: Set<string> = new Set();
  private activeRequests: Map<string, AbortController> = new Map();

  static getInstance(): NetworkOptimizer {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer();
    }
    return NetworkOptimizer.instance;
  }

  initialize(): void {
    this.setupNetworkMonitoring();
    this.setupRequestInterception();
    this.setupOfflineSupport();
    this.initializePreloading();
  }

  private setupNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection.effectiveType;

      connection.addEventListener('change', () => {
        this.connectionType = connection.effectiveType;
        this.adjustQualityBasedOnConnection();
      });
    }
  }

  private adjustQualityBasedOnConnection(): void {
    const quality = {
      'slow-2g': 0,
      '2g': 1,
      '3g': 2,
      '4g': 3
    }[this.connectionType] || 2;

    document.documentElement.style.setProperty('--image-quality', quality.toString());
    this.updateLoadingStrategies(quality);
  }

  private setupRequestInterception(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.url;
      const abortController = new AbortController();
      
      // Add abort signal to request
      init = {
        ...init,
        signal: abortController.signal
      };

      this.activeRequests.set(url, abortController);

      try {
        // Check cache first
        const cachedResponse = await this.checkCache(url);
        if (cachedResponse) {
          this.activeRequests.delete(url);
          return cachedResponse;
        }

        // Queue similar requests
        if (this.networkQueue.has(url)) {
          return this.networkQueue.get(url);
        }

        const priority = this.getRequestPriority(url);
        const timeoutDuration = this.getTimeoutDuration(priority);

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            abortController.abort();
            reject(new Error('Request timeout'));
          }, timeoutDuration);
        });

        const fetchPromise = originalFetch(input, init).then(response => {
          this.networkQueue.delete(url);
          this.activeRequests.delete(url);
          
          // Cache successful responses
          if (response.ok) {
            this.cacheResponse(url, response.clone());
          }
          
          return response;
        });

        const promise = Promise.race([fetchPromise, timeoutPromise]);
        this.networkQueue.set(url, promise);
        
        return promise;
      } catch (error) {
        this.networkQueue.delete(url);
        this.activeRequests.delete(url);
        throw error;
      }
    };
  }

  private async checkCache(url: string): Promise<Response | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open('network-cache');
        const response = await cache.match(url);
        
        if (response) {
          const cacheTime = parseInt(response.headers.get('cache-time') || '0', 10);
          const maxAge = this.getCacheMaxAge(url);
          
          if (Date.now() - cacheTime < maxAge) {
            // Valid cache
            return response;
          } else {
            // Expired cache - remove it
            cache.delete(url);
          }
        }
      } catch (error) {
        console.error('Cache error:', error);
      }
    }
    return null;
  }

  private async cacheResponse(url: string, response: Response): Promise<void> {
    if ('caches' in window && this.shouldCache(url)) {
      try {
        const cache = await caches.open('network-cache');
        const headers = new Headers(response.headers);
        headers.set('cache-time', Date.now().toString());
        
        const cachedResponse = new Response(await response.blob(), {
          headers: headers,
          status: response.status,
          statusText: response.statusText
        });
        
        await cache.put(url, cachedResponse);
      } catch (error) {
        console.error('Caching error:', error);
      }
    }
  }

  private getRequestPriority(url: string): 'high' | 'medium' | 'low' {
    if (url.includes('/api/critical/') || url.includes('/api/user/')) {
      return 'high';
    }
    if (url.includes('/api/')) {
      return 'medium';
    }
    return 'low';
  }

  private getTimeoutDuration(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 5000;  // 5 seconds
      case 'medium': return 10000; // 10 seconds
      case 'low': return 15000; // 15 seconds
    }
  }

  private getCacheMaxAge(url: string): number {
    if (url.includes('/api/static/')) {
      return 7 * 24 * 60 * 60 * 1000; // 7 days
    }
    if (url.includes('/api/')) {
      return 5 * 60 * 1000; // 5 minutes
    }
    return 60 * 60 * 1000; // 1 hour default
  }

  private shouldCache(url: string): boolean {
    // Don't cache user-specific or sensitive data
    return !url.includes('/api/user/') && 
           !url.includes('/api/auth/') &&
           !url.includes('/api/payment/');
  }

  private setupOfflineSupport(): void {
    window.addEventListener('online', () => {
      this.retryFailedRequests();
    });

    window.addEventListener('offline', () => {
      this.pauseNonEssentialRequests();
    });
  }

  private async retryFailedRequests(): Promise<void> {
    const failedRequests = await this.getFailedRequests();
    failedRequests.forEach(request => {
      fetch(request.url, request.init);
    });
  }

  private pauseNonEssentialRequests(): void {
    this.activeRequests.forEach((controller, url) => {
      if (this.getRequestPriority(url) === 'low') {
        controller.abort();
      }
    });
  }

  // Add this to your existing index.tsx:
  public static initializeInApp(): void {
    const networkOptimizer = NetworkOptimizer.getInstance();
    networkOptimizer.initialize();
  }
}

export const networkOptimizer = NetworkOptimizer.getInstance();
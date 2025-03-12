export class AggressiveOptimizer {
  private static instance: AggressiveOptimizer;
  private isLowEndDevice: boolean;
  private optimizationLevel: number = 0; // 0-3: none to extreme

  static getInstance(): AggressiveOptimizer {
    if (!AggressiveOptimizer.instance) {
      AggressiveOptimizer.instance = new AggressiveOptimizer();
    }
    return AggressiveOptimizer.instance;
  }

  initialize(): void {
    this.detectDeviceCapabilities();
    this.setupOptimizations();
    this.monitorPerformance();
  }

  private detectDeviceCapabilities(): void {
    this.isLowEndDevice = this.checkIsLowEndDevice();
    
    if (this.isLowEndDevice) {
      this.optimizationLevel = 3; // Maximum optimization
    }
  }

  private checkIsLowEndDevice(): boolean {
    return (
      ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) ||
      ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4)
    );
  }

  private setupOptimizations(): void {
    // Disable expensive CSS features
    document.documentElement.style.setProperty(
      '--enable-animations', 
      this.optimizationLevel < 2 ? '1' : '0'
    );

    // Set up intersection observer for extreme lazy loading
    this.setupLazyLoading();

    // Debounce all event listeners
    this.debounceEventListeners();

    // Virtual scroll for all lists
    this.virtualizeScrolling();
  }

  private setupLazyLoading(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            if (element.dataset.src) {
              element.setAttribute('src', element.dataset.src);
              delete element.dataset.src;
              observer.unobserve(element);
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
      observer.observe(element);
    });
  }

  private debounceEventListeners(): void {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const debouncedListener = AggressiveOptimizer.debounce(
        listener as Function,
        50
      );
      originalAddEventListener.call(this, type, debouncedListener, options);
    };
  }

  private static debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  private virtualizeScrolling(): void {
    document.querySelectorAll('.scroll-container').forEach(container => {
      this.applyVirtualScroll(container as HTMLElement);
    });
  }

  private applyVirtualScroll(container: HTMLElement): void {
    const items = Array.from(container.children);
    const itemHeight = items[0]?.getBoundingClientRect().height || 0;
    
    let visibleItems = Math.ceil(container.clientHeight / itemHeight);
    let totalItems = items.length;
    
    container.style.height = `${totalItems * itemHeight}px`;
    
    let lastScrollTop = 0;
    container.addEventListener('scroll', () => {
      const scrollTop = container.scrollTop;
      const startIndex = Math.floor(scrollTop / itemHeight);
      
      // Only render visible items plus buffer
      for (let i = 0; i < totalItems; i++) {
        const item = items[i] as HTMLElement;
        if (i >= startIndex - visibleItems && i <= startIndex + visibleItems * 2) {
          item.style.display = '';
          item.style.transform = `translateY(${i * itemHeight}px)`;
        } else {
          item.style.display = 'none';
        }
      }
      
      lastScrollTop = scrollTop;
    });
  }
}
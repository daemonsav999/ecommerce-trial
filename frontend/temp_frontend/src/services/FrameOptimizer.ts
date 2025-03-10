export class FrameOptimizer {
  private static instance: FrameOptimizer;
  private targetFPS: number = 60;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private animationQueue: Set<() => void> = new Set();

  static getInstance(): FrameOptimizer {
    if (!FrameOptimizer.instance) {
      FrameOptimizer.instance = new FrameOptimizer();
    }
    return FrameOptimizer.instance;
  }

  initialize(): void {
    this.startFrameLoop();
    this.monitorPerformance();
  }

  private startFrameLoop(): void {
    const loop = (timestamp: number) => {
      const deltaTime = timestamp - this.lastFrameTime;
      
      if (deltaTime >= (1000 / this.targetFPS)) {
        this.processFrame();
        this.lastFrameTime = timestamp;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  private processFrame(): void {
    this.frameCount++;
    
    // Process queued animations
    this.animationQueue.forEach(animation => {
      try {
        animation();
      } catch (error) {
        console.error('Animation error:', error);
      }
    });

    // Clear queue after processing
    this.animationQueue.clear();
  }

  queueAnimation(animation: () => void): void {
    this.animationQueue.add(animation);
  }

  private monitorPerformance(): void {
    setInterval(() => {
      const fps = this.frameCount;
      this.frameCount = 0;

      if (fps < this.targetFPS * 0.9) { // Below 90% of target
        this.optimizePerformance();
      }
    }, 1000);
  }

  private optimizePerformance(): void {
    // Reduce visual effects
    document.body.classList.add('optimize-performance');
    
    // Defer non-critical animations
    this.deferNonCriticalAnimations();
    
    // Schedule cleanup
    setTimeout(() => {
      document.body.classList.remove('optimize-performance');
    }, 5000);
  }

  private deferNonCriticalAnimations(): void {
    requestIdleCallback(() => {
      // Process deferred animations when CPU is less busy
      this.processDeferredAnimations();
    });
  }
}

export const frameOptimizer = FrameOptimizer.getInstance();
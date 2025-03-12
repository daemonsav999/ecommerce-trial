export class RenderOptimizer {
  private static instance: RenderOptimizer;
  private frameTime: number = 1000 / 60; // Target 60fps
  private renderQueue: Map<string, () => void> = new Map();
  private isRendering: boolean = false;

  static getInstance(): RenderOptimizer {
    if (!RenderOptimizer.instance) {
      RenderOptimizer.instance = new RenderOptimizer();
    }
    return RenderOptimizer.instance;
  }

  initialize(): void {
    this.setupRenderLoop();
    this.optimizeStyles();
    this.setupLayoutOptimizations();
  }

  private setupRenderLoop(): void {
    let lastFrameTime = performance.now();

    const render = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameTime;

      if (deltaTime >= this.frameTime) {
        this.processRenderQueue();
        lastFrameTime = timestamp;
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }

  private processRenderQueue(): void {
    if (this.isRendering) return;
    this.isRendering = true;

    try {
      this.renderQueue.forEach((callback, key) => {
        callback();
        this.renderQueue.delete(key);
      });
    } finally {
      this.isRendering = false;
    }
  }

  private optimizeStyles(): void {
    // Use CSS containment
    document.body.style.contain = 'content';

    // Optimize animations
    document.documentElement.style.setProperty(
      '--optimize-animations',
      'transform, opacity'
    );

    // Use will-change sparingly
    document.querySelectorAll('.animate').forEach(element => {
      element.setAttribute('style', 'will-change: transform');
    });
  }

  private setupLayoutOptimizations(): void {
    // Batch DOM reads
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(...args) {
      requestAnimationFrame(() => {});
      return originalGetComputedStyle.apply(this, args);
    };

    // Batch DOM writes
    this.batchDOMWrites();
  }

  private batchDOMWrites(): void {
    const writes: Array<() => void> = [];
    
    const flush = () => {
      const ops = writes.slice();
      writes.length = 0;
      ops.forEach(op => op());
    };

    // Override style setters
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(...args) {
      writes.push(() => originalSetProperty.apply(this, args));
      requestAnimationFrame(flush);
    };
  }

  queueRender(key: string, callback: () => void): void {
    this.renderQueue.set(key, callback);
  }
}
interface ResourceConfig {
  priority: 'high' | 'medium' | 'low';
  cacheTime: number;
  preload: boolean;
}

export class ResourceLoader {
  private static instance: ResourceLoader;
  private loadQueue: Map<string, ResourceConfig> = new Map();
  private connectionType: string = 'unknown';
  private deviceMemory: number = 4; // Default 4GB

  static getInstance(): ResourceLoader {
    if (!ResourceLoader.instance) {
      ResourceLoader.instance = new ResourceLoader();
    }
    return ResourceLoader.instance;
  }

  initialize(): void {
    this.detectCapabilities();
    this.setupNetworkListener();
    this.startQueueProcessor();
  }

  private detectCapabilities(): void {
    if ('connection' in navigator) {
      this.connectionType = (navigator as any).connection.effectiveType;
      (navigator as any).connection.addEventListener('change', 
        this.handleConnectionChange.bind(this)
      );
    }

    if ('deviceMemory' in navigator) {
      this.deviceMemory = (navigator as any).deviceMemory;
    }
  }

  private handleConnectionChange(): void {
    const connection = (navigator as any).connection;
    this.connectionType = connection.effectiveType;
    this.adjustLoadingStrategy();
  }

  private adjustLoadingStrategy(): void {
    switch (this.connectionType) {
      case '4g':
        this.enableHighQuality();
        break;
      case '3g':
        this.enableMediumQuality();
        break;
      default:
        this.enableLowQuality();
    }
  }

  private enableHighQuality(): void {
    // Load high-resolution images
    // Enable animations
    document.body.classList.remove('reduce-quality');
  }

  private enableLowQuality(): void {
    // Load low-resolution images
    // Disable animations
    document.body.classList.add('reduce-quality');
  }

  async loadResource(url: string, config: ResourceConfig): Promise<any> {
    if (this.shouldPreload(config)) {
      this.preloadResource(url);
    }

    try {
      const cachedResource = await this.getFromCache(url);
      if (cachedResource) return cachedResource;

      const resource = await this.fetchWithPriority(url, config);
      await this.cacheResource(url, resource, config);
      return resource;
    } catch (error) {
      console.error('Failed to load resource:', error);
      return this.getFallbackResource(url);
    }
  }

  private async fetchWithPriority(
    url: string, 
    config: ResourceConfig
  ): Promise<Response> {
    const priority = config.priority === 'high' ? 'high' : 'low';
    
    return fetch(url, {
      priority: priority as RequestPriority,
      cache: 'force-cache',
    });
  }

  private shouldPreload(config: ResourceConfig): boolean {
    return config.preload && this.hasAvailableResources();
  }

  private hasAvailableResources(): boolean {
    return this.deviceMemory > 2 && this.connectionType === '4g';
  }
}

export const resourceLoader = ResourceLoader.getInstance();
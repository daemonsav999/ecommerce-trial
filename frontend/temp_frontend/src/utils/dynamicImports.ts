import { lazy, Suspense } from 'react';

export const lazyLoad = (
  importFunc: () => Promise<any>,
  fallback: React.ReactNode = null
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Usage example for routes
export const routes = {
  Home: lazyLoad(() => import('../pages/Home')),
  ProductList: lazyLoad(() => import('../pages/ProductList')),
  ProductDetail: lazyLoad(() => import('../pages/ProductDetail')),
  Cart: lazyLoad(() => import('../pages/Cart')),
  Checkout: lazyLoad(() => import('../pages/Checkout')),
  Profile: lazyLoad(() => import('../pages/Profile')),
};

// Prefetch critical routes
export const prefetchCriticalRoutes = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Prefetch most common routes
      import('../pages/Home');
      import('../pages/ProductList');
      import('../pages/ProductDetail');
    });
  }
};
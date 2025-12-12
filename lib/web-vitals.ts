import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

type WebVitalsCallback = (metric: Metric) => void;

// Function to send metrics to analytics service
function sendToAnalytics(metric: Metric) {
  // In production, send to your analytics service
  // Example: Google Analytics, Vercel Analytics, etc.
  
  if (process.env.NODE_ENV === 'development') {
    // Log in development
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Example: Send to Vercel Analytics (if using)
  // if (typeof window !== 'undefined' && (window as any).va) {
  //   (window as any).va('web-vital', {
  //     name: metric.name,
  //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //     id: metric.id,
  //   });
  // }

  // Example: Send to Google Analytics
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', metric.name, {
  //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  //     metric_id: metric.id,
  //     metric_value: metric.value,
  //     metric_delta: metric.delta,
  //   });
  // }
}

// Report all Web Vitals
export function reportWebVitals(onPerfEntry?: WebVitalsCallback) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS((metric) => {
      sendToAnalytics(metric);
      onPerfEntry(metric);
    });
    // Note: onFID is deprecated, use onINP instead
    onFCP((metric) => {
      sendToAnalytics(metric);
      onPerfEntry(metric);
    });
    onLCP((metric) => {
      sendToAnalytics(metric);
      onPerfEntry(metric);
    });
    onTTFB((metric) => {
      sendToAnalytics(metric);
      onPerfEntry(metric);
    });
    onINP((metric) => {
      sendToAnalytics(metric);
      onPerfEntry(metric);
    });
  }
}




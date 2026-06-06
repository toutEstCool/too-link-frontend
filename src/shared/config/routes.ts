export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  SUBSCRIBERS: '/subscribers',
  SUBSCRIBERS_CREATE: '/subscribers/create',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

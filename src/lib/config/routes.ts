// Route configuration
export const ROUTES = {
  home: '/home',
  setup: '/setup',
  rewards: '/rewards',
  module: (name: string) => `/module/${name}`,
  play: (activityId: string) => `/play/${activityId}`
};

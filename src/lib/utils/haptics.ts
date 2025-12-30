export function triggerHaptics(type: 'light' | 'medium' | 'heavy'): void {
  if (!navigator.vibrate) {
    console.warn('Vibration API not supported');
    return;
  }

  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: [20, 10, 20],
    heavy: [30, 20, 30]
  };

  navigator.vibrate(patterns[type]);
}

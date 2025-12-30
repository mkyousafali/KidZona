export function generateId(): string {
  return crypto.getRandomValues(new Uint8Array(16)).toString();
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 11);
}

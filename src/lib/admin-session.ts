import crypto from "crypto";

const validTokens = new Set<string>();

export function createSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  validTokens.add(token);
  return token;
}

export function validateSession(token: string): boolean {
  return validTokens.has(token);
}

export function destroySession(token: string): void {
  validTokens.delete(token);
}

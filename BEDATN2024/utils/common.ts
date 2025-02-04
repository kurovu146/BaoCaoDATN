import * as crypto from 'crypto';

export function generateStreamKey(): string {
  return crypto.randomBytes(16).toString('hex');
}
/**
 * Two-Factor Authentication (2FA) Utilities using TOTP (Time-based One-Time Password)
 * Based on Google Authenticator protocol
 */

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from "crypto";
/**
 * Generate 2FA secret and QR code for user setup
 */
export async function generateTwoFactorSecret(
  email: string,
  appName: string = 'SOREA'
): Promise<{ manualEntryKey: string; qrCodeUrl: string; secret: string; qrCode: string; backupCodes: string[] }> {
  const secret = speakeasy.generateSecret({
    name: `${appName} (${email})`,
    issuer: appName,
    length: 32,
  });

  if (!secret.otpauth_url) {
    throw new Error('Failed to generate QR code URL');
  }

  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  // Generate backup codes (10 codes for emergency access)
  const backupCodes = generateBackupCodes(10);

  return {
    manualEntryKey: secret.base32,
    qrCodeUrl: qrCode,
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

/**
 * Verify TOTP token
 */

export function verifyTwoFactorToken(
  secret: string,
  token: string
): boolean {
  if (!isValidTotpTokenFormat(token)) {
    return false;
  }

  try {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1,
    });
  } catch {
    return false;
  }
}



/**
 * Verify backup code and mark as used
 */
export function verifyBackupCode(code: string, usedBackupCodes: string[]): boolean {
  // Codes are hashed in database, so we compare hashes
  // This function assumes codes are already hashed
return usedBackupCodes.includes(
   code.trim().toUpperCase() );
}


/**
 * Generate backup codes
 */
export function generateBackupCodes(
  count: number = 10
): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase();

    codes.push(code);
  }

  return codes;
}



/**
 * Validate backup code format
 */
export function isValidBackupCodeFormat(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

/**
 * Format TOTP token for display (often formatted as XXX-XXX)
 */
export function formatTotpToken(token: string): string {
  if (token.length !== 6) return token;
  return `${token.slice(0, 3)}-${token.slice(3)}`;
}

/**
 * Validate TOTP token format (should be 6 digits)
 */
export function isValidTotpTokenFormat(token: string): boolean {
  return /^\d{6}$/.test(token);
}

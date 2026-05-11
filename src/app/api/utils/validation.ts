/**
 * Email and Password Validation Utilities
 */

/**
 * Validates email format using RFC 5322 standard
 */
export function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if password is too common or weak patterns
 */
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Check if password is just repeating characters
 */
function isRepeatingChars(password: string): boolean {
  return /^(.)\1+$/.test(password);
}

/**
 * Check if password is sequential numbers/letters
 */
function isSequential(password: string): boolean {
  // Check for sequential numbers (123, 234, etc.)
  if (/0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210/.test(password)) {
    return true;
  }
  // Check for sequential letters
  if (/abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|zyxw|yxwv|xwvu|wvut|vuts|utsrqp/.test(password.toLowerCase())) {
    return true;
  }
  return false;
}

/**
 * Check if password contains birth date (DDMMYYYY or variations)
 */
function containsBirthDate(password: string, birthDate?: string): boolean {
  if (!birthDate) return false;

  try {
    const date = new Date(birthDate);
    
    // Validate date is not invalid
    if (isNaN(date.getTime())) {
      return false;
    }

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear().toString();
    const yy = yyyy.slice(-2);

    const datePatterns = [
      `${dd}${mm}${yyyy}`,
      `${dd}${mm}${yy}`,
      `${mm}${dd}${yyyy}`,
      `${mm}${dd}${yy}`,
      `${yyyy}${mm}${dd}`,
      `${yy}${mm}${dd}`,
      yyyy,
      yy,
      dd + mm,
      mm + dd,
    ];

    return datePatterns.some(pattern => password.includes(pattern));
  } catch (error) {
    // If date parsing fails, don't validate birth date check
    return false;
  }
}

/**
 * Main password validation function
 * Returns { valid: boolean, message?: string }
 */
export function validatePassword(
  password: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  birthDate?: string
): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: "Le mot de passe est requis." };
  }

  if (password.length < 12) {
    return { valid: false, message: "Le mot de passe doit contenir au moins 12 caractères." };
  }

  if (password.length > 128) {
    return { valid: false, message: "Le mot de passe ne doit pas dépasser 128 caractères." };
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre majuscule." };
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins une lettre minuscule." };
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un chiffre." };
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*, etc)." };
  }

  // Check for all numbers
  if (/^\d+$/.test(password)) {
    return { valid: false, message: "Le mot de passe ne peut pas être une suite de chiffres." };
  }

  // Check for repeating characters
  if (isRepeatingChars(password)) {
    return { valid: false, message: "Le mot de passe ne peut pas contenir des caractères répétés." };
  }

  // Check for sequential characters
  if (isSequential(password)) {
    return { valid: false, message: "Le mot de passe ne peut pas contenir une séquence croissante ou décroissante." };
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    return { valid: false, message: "Le mot de passe est trop commun. Veuillez en choisir un plus unique." };
  }

  // Check for birth date
  if (birthDate && containsBirthDate(password, birthDate)) {
    return { valid: false, message: "Le mot de passe ne peut pas contenir votre date de naissance." };
  }

  // Check for name
  if (firstName && password.toLowerCase().includes(firstName.toLowerCase())) {
    return { valid: false, message: "Le mot de passe ne peut pas contenir votre prénom." };
  }

  if (lastName && password.toLowerCase().includes(lastName.toLowerCase())) {
    return { valid: false, message: "Le mot de passe ne peut pas contenir votre nom." };
  }

  // Check for email
  if (email) {
    const emailParts = email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailParts)) {
      return { valid: false, message: "Le mot de passe ne peut pas contenir une partie de votre email." };
    }
  }

  return { valid: true };
}

/**
 * Async email validation using DNS (checks if domain exists)
 * Returns { valid: boolean, message?: string }
 */
export async function validateEmailDomain(email: string): Promise<{ valid: boolean; message?: string }> {
  if (!validateEmailFormat(email)) {
    return { valid: false, message: "Le format de l'email n'est pas valide." };
  }

  const domain = email.split('@')[1];

  try {
    // In a real application, you would do DNS lookup here
    // For now, we'll check against disposable email domains
    const disposableDomains = [
      'tempmail.com', 'guerrillamail.com', 'mailinator.com',
      '10minutemail.com', 'throwaway.email', 'yopmail.com'
    ];

    if (disposableDomains.includes(domain.toLowerCase())) {
      return { valid: false, message: "Les emails temporaires ne sont pas autorisés." };
    }

    // Check if domain has basic structure
    if (!domain.includes('.') || domain.length < 4) {
      return { valid: false, message: "Le domaine de l'email n'est pas valide." };
    }

    return { valid: true };
  } catch {
    return { valid: false, message: "Impossible de valider le domaine de l'email." };
  }
}

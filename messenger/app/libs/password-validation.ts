// Password validation utility

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
  score: number; // 0-100
}

interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxLength?: number;
}

const DEFAULT_RULES: PasswordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional but encouraged
  maxLength: 128,
};

// Common weak passwords to reject
const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "12345678",
  "123456789",
  "qwerty123",
  "letmein",
  "welcome",
  "admin123",
  "iloveyou",
  "sunshine",
  "princess",
  "football",
  "monkey",
  "shadow",
  "master",
  "dragon",
  "michael",
  "qwertyuiop",
  "abc123",
  "password1",
]);

export function validatePassword(
  password: string,
  rules: Partial<PasswordRules> = {}
): PasswordValidationResult {
  const config = { ...DEFAULT_RULES, ...rules };
  const errors: string[] = [];
  let score = 0;

  // Check if password is provided
  if (!password) {
    return {
      valid: false,
      errors: ["Password is required"],
      strength: "weak",
      score: 0,
    };
  }

  // Check minimum length
  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters`);
  } else {
    score += 20;
  }

  // Check maximum length
  if (config.maxLength && password.length > config.maxLength) {
    errors.push(`Password must be at most ${config.maxLength} characters`);
  }

  // Check for uppercase
  const hasUppercase = /[A-Z]/.test(password);
  if (config.requireUppercase && !hasUppercase) {
    errors.push("Password must contain at least one uppercase letter");
  } else if (hasUppercase) {
    score += 15;
  }

  // Check for lowercase
  const hasLowercase = /[a-z]/.test(password);
  if (config.requireLowercase && !hasLowercase) {
    errors.push("Password must contain at least one lowercase letter");
  } else if (hasLowercase) {
    score += 15;
  }

  // Check for numbers
  const hasNumbers = /\d/.test(password);
  if (config.requireNumbers && !hasNumbers) {
    errors.push("Password must contain at least one number");
  } else if (hasNumbers) {
    score += 15;
  }

  // Check for special characters
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (config.requireSpecialChars && !hasSpecialChars) {
    errors.push("Password must contain at least one special character");
  } else if (hasSpecialChars) {
    score += 20;
  }

  // Check for common passwords
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push("This password is too common. Please choose a stronger password.");
    score = Math.min(score, 20); // Cap score for common passwords
  }

  // Check for sequential characters (e.g., "123", "abc")
  if (/(.)\1{2,}/.test(password) || /012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg/i.test(password)) {
    score -= 10;
  }

  // Bonus for length
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 5;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine strength
  let strength: PasswordValidationResult["strength"];
  if (score < 30) {
    strength = "weak";
  } else if (score < 50) {
    strength = "fair";
  } else if (score < 75) {
    strength = "good";
  } else {
    strength = "strong";
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score,
  };
}

// Quick validation for API use
export function isPasswordValid(password: string): boolean {
  return validatePassword(password).valid;
}

// Get password requirements for display
export function getPasswordRequirements(): string[] {
  return [
    "At least 8 characters long",
    "Contains at least one uppercase letter (A-Z)",
    "Contains at least one lowercase letter (a-z)",
    "Contains at least one number (0-9)",
    "Special characters recommended (!@#$%^&*)",
  ];
}

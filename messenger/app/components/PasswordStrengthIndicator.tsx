'use client';

import { useMemo } from 'react';
import clsx from 'clsx';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface StrengthInfo {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

function calculateStrength(password: string): StrengthInfo {
  if (!password) {
    return { score: 0, label: '', color: '', bgColor: 'bg-gray-200' };
  }

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 5;

  // Character type checks
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 20;

  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score -= 10;
  if (/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def/i.test(password)) score -= 10;

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine strength level
  if (score < 30) {
    return { score, label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500' };
  }
  if (score < 50) {
    return { score, label: 'Fair', color: 'text-orange-500', bgColor: 'bg-orange-500' };
  }
  if (score < 75) {
    return { score, label: 'Good', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
  }
  return { score, label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500' };
}

export default function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={clsx('space-y-1', className)}>
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-300', strength.bgColor)}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {/* Label */}
      <div className="flex justify-between items-center text-xs">
        <span className={clsx('font-medium', strength.color)}>
          {strength.label}
        </span>
        <span className="text-gray-400">
          {strength.score}%
        </span>
      </div>
    </div>
  );
}

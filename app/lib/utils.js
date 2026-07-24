import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx conditionals.
 * @param  {...any} inputs - Class names or conditional objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in ILS (Israeli Shekel).
 * @param {number} price 
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate a URL-safe slug from a string.
 * @param {string} str 
 * @returns {string}
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u0590-\u05FF-]+/g, '') // Keep Hebrew characters
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Sanitize an array of database rows for client-side serialization.
 * Removes non-serializable values (like Date objects).
 * @param {Array} arr
 * @returns {Array}
 */
export function sanitizeArray(arr) {
  if (!arr || !Array.isArray(arr)) return [];
  return JSON.parse(JSON.stringify(arr));
}

/**
 * Get relative time in Hebrew.
 * @param {string|Date} date
 * @returns {string}
 */
export function getRelativeTimeHe(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
  if (diffDays < 365) return `לפני ${Math.floor(diffDays / 30)} חודשים`;
  return `לפני ${Math.floor(diffDays / 365)} שנים`;
}

/**
 * Truncate text with ellipsis.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

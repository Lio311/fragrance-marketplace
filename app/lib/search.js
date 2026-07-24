/**
 * Hebrew keyboard mapping for English-to-Hebrew transliteration.
 * When users type on English keyboard but mean Hebrew.
 */
const EN_TO_HE_MAP = {
  q: '/', w: "'", e: 'ק', r: 'ר', t: 'א', y: 'ט', u: 'ו', i: 'ן', o: 'ם', p: 'פ',
  a: 'ש', s: 'ד', d: 'ג', f: 'כ', g: 'ע', h: 'י', j: 'ח', k: 'ל', l: 'ך',
  z: 'ז', x: 'ס', c: 'ב', v: 'ה', b: 'נ', n: 'מ', m: 'צ',
};

/**
 * Transliterate English keyboard input to Hebrew.
 * @param {string} input
 * @returns {string}
 */
export function englishToHebrew(input) {
  return input
    .toLowerCase()
    .split('')
    .map((char) => EN_TO_HE_MAP[char] || char)
    .join('');
}

/**
 * Calculate Levenshtein distance between two strings.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Check if a query fuzzy-matches a target string.
 * @param {string} query
 * @param {string} target
 * @param {number} tolerance - Max allowed edit distance
 * @returns {boolean}
 */
export function fuzzyMatch(query, target, tolerance = 2) {
  if (!query || !target) return false;

  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  // Exact substring match
  if (t.includes(q)) return true;

  // Try English-to-Hebrew transliteration
  const heQuery = englishToHebrew(q);
  if (t.includes(heQuery)) return true;

  // Levenshtein distance for typo tolerance
  const words = t.split(/\s+/);
  for (const word of words) {
    if (levenshtein(q, word) <= tolerance) return true;
    if (levenshtein(heQuery, word) <= tolerance) return true;
  }

  return false;
}

/**
 * Build a PostgreSQL full-text search query from user input.
 * @param {string} input
 * @returns {string}
 */
export function buildSearchQuery(input) {
  if (!input) return '';
  const terms = input.trim().split(/\s+/).filter(Boolean);
  return terms.map((term) => `${term}:*`).join(' & ');
}

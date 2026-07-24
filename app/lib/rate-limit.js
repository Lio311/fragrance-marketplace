const cache = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  let requests = cache.get(ip) || [];
  requests = requests.filter((timestamp) => timestamp > windowStart);

  if (requests.length >= limit) {
    return { success: false, limit, remaining: 0, reset: requests[0] + windowMs };
  }

  requests.push(now);
  cache.set(ip, requests);
  return { success: true, limit, remaining: limit - requests.length, reset: now + windowMs };
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of cache.entries()) {
      const valid = requests.filter((ts) => ts > now - 300000);
      if (valid.length === 0) cache.delete(ip);
      else cache.set(ip, valid);
    }
  }, 300000);
}

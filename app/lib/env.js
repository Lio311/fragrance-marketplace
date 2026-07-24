const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missing.join(', ')}. Some features may not work.`
    );
  }
}

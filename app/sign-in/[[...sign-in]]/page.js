import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'התחברות',
};

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-card-hover rounded-2xl',
          },
        }}
      />
    </div>
  );
}

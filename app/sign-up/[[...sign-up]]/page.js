import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'הרשמה',
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <SignUp
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

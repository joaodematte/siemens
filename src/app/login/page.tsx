import { LoginForm } from '@/components/forms/login-form';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow">
        <LoginForm />
      </div>
    </div>
  );
}

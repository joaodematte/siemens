import { RegisterForm } from '@/components/forms/register-form';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow">
        <RegisterForm />
      </div>
    </div>
  );
}

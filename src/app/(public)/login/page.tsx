import { Metadata } from 'next';

import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'dflow | Login'
};

export default function Login() {
  return <LoginForm />;
}

import { Metadata } from 'next';

import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Login'
};

export default function Login() {
  return <LoginForm />;
}

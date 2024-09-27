import { Metadata } from 'next';

import { RegisterForm } from '@/components/forms/register-form';

export const metadata: Metadata = {
  title: 'dflow | Registro'
};

export default function Register() {
  return <RegisterForm />;
}

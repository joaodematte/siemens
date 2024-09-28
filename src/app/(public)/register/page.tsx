import { Metadata } from 'next';

import { RegisterForm } from '@/components/forms/register-form';

export const metadata: Metadata = {
  title: 'Topsun Engenharia | Registro'
};

export default function Register() {
  return <RegisterForm />;
}

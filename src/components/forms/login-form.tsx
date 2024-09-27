'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingIcon } from '@/components/loading-icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginAction } from '@/server/actions/auth/login-action';
import { loginSchema } from '@/server/schemas/auth/login-schema';

export function LoginForm() {
  const router = useRouter();

  const { execute, isPending } = useAction(loginAction, {
    onSuccess: () => {
      toast.success(
        'Login realizado com sucesso, redirecionando ao dashboard...'
      );

      router.push('/');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@topsun.com.br"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex w-full justify-between">
                <span>Senha</span>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline"
                >
                  Esqueceu sua senha?
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isPending}>
          {isPending ?
            <LoadingIcon className="h-4 w-4" />
          : 'Confirmar'}
        </Button>
        <Link
          href="/register"
          className="mt-2 text-center text-xs text-muted-foreground underline"
        >
          Não tem uma conta? Registre-se
        </Link>
      </form>
    </Form>
  );
}

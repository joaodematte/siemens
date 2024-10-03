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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/server/actions/auth/register-action';
import { registerSchema } from '@/server/schemas/auth/register-schema';

export function RegisterForm() {
  const router = useRouter();

  const { execute, isPending } = useAction(registerAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      router.push('/login');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
              <FormDescription>
                Necessário terminar com @topsun.com.br
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  autoComplete="new-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  autoComplete="new-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={isPending}>
          {isPending ? <LoadingIcon className="h-4 w-4" /> : 'Confirmar'}
        </Button>
        <Link
          href="/login"
          className="mt-2 text-center text-xs text-muted-foreground underline"
        >
          Voltar à página de login
        </Link>
      </form>
    </Form>
  );
}

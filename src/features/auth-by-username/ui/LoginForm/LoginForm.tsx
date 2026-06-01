import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/card';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

// Схема валидации Zod
const loginSchema = z.object({
  username: z.string()
    .min(3, { message: 'Имя пользователя должно быть не менее 3 символов' })
    .max(50, { message: 'Слишком длинное имя пользователя' }),
  password: z.string()
    .min(6, { message: 'Пароль должен быть не менее 6 символов' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Использование React Query useMutation для авторизации
  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await api.post('/admin/auth/login', {
        username: values.username,
        password: values.password
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Сохраняем информацию об админе (без токена, так как он лежит в куках)
      if (data.admin) {
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      }
      navigate('/', { replace: true });
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const isPending = loginMutation.isPending;
  const apiError = loginMutation.error
    ? (axios.isAxiosError<{ error?: string }>(loginMutation.error)
      ? (loginMutation.error.response?.data?.error || 'Ошибка соединения с сервером')
      : 'Неизвестная ошибка')
    : null;

  return (
    <Card className="w-full border-zinc-800/60 bg-black/60 backdrop-blur-3xl text-zinc-100 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-md py-6">
      <CardHeader className="space-y-2 text-center pb-4">
        <CardTitle className="text-xl font-bold tracking-[0.25em] text-white uppercase font-sans">
          Too-Link Billing
        </CardTitle>
        <CardDescription className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase">
          Вход в панель управления
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          
          {/* Ошибка запроса */}
          {apiError && (
            <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/30 rounded-md p-3 text-xs text-red-400 uppercase tracking-wider font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Логин */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
              Имя пользователя
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="username"
                disabled={isPending}
                className={`bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-sm h-11 text-sm tracking-wide ${errors.username ? 'border-red-650' : 'border-zinc-800'}`}
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-400 font-medium tracking-wide">{errors.username.message}</p>
            )}
          </div>

          {/* Пароль */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
              Пароль
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="password"
                disabled={isPending}
                className={`bg-zinc-950/80 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-sm h-11 text-sm tracking-wide pr-10 ${errors.password ? 'border-red-650' : 'border-zinc-800'}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-650 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-medium tracking-wide">{errors.password.message}</p>
            )}
          </div>

        </CardContent>
        
        <CardFooter className="bg-transparent border-t-0 p-5 pt-0">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-[0.2em] text-xs h-11 rounded-sm cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-5"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Проверка...</span>
              </>
            ) : (
              <span>Войти в систему</span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

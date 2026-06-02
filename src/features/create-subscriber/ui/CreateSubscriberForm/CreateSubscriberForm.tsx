import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, ShieldAlert } from 'lucide-react';

import { useTariffsQuery } from '@/entities/tariff';
import { useCreateSubscriberMutation } from '../../api/mutations';
import { subscriberSchema, type SubscriberFormValues } from '../../model/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/shared/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export const CreateSubscriberForm: React.FC = () => {
  const navigate = useNavigate();
  const { data: tariffs = [], isLoading: isTariffsLoading, isError: isTariffsError } = useTariffsQuery();
  const createMutation = useCreateSubscriberMutation();

  const form = useForm<SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      village: '',
      address: '',
      tariffId: '',
      ipAddress: '',
      macAddress: '',
      speedLimit: '',
      mikrotikComment: '',
    },
  });

  const onSubmit = (values: SubscriberFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        // При успешном создании возвращаемся к списку абонентов
        navigate('/subscribers');
      },
    });
  };

  const isPending = createMutation.isPending || isTariffsLoading;
  const apiError = createMutation.error
    ? (axios.isAxiosError<{ error?: string }>(createMutation.error)
      ? (createMutation.error.response?.data?.error || 'Ошибка сохранения абонента')
      : 'Неизвестная ошибка')
    : isTariffsError
    ? 'Не удалось загрузить список тарифов. Проверьте работу бэкенда.'
    : null;

  return (
    <Card className="w-full border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-zinc-50 rounded-xl py-4">
      <CardHeader className="space-y-1.5 text-center pb-6">
        <CardTitle className="text-lg font-bold tracking-[0.15em] text-white uppercase font-sans">
          Регистрация Абонента
        </CardTitle>
        <CardDescription className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase">
          Код Finik и параметры авторизации FreeRADIUS генерируются автоматически
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            {apiError && (
              <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-xs text-red-400 uppercase tracking-wider font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Блок 1: Личные данные */}
            <div className="space-y-4 border-b border-zinc-800/60 pb-6">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500">
                Абонентские данные
              </h3>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                      ФИО Абонента
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Токтосунов Асан"
                        disabled={isPending}
                        className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.fullName ? 'border-red-650' : 'border-zinc-800'}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Номер телефона
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+996700000001"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.phone ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tariffId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Тарифный план
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={`w-full bg-zinc-950/40 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.tariffId ? 'border-red-650' : 'border-zinc-800'}`}>
                            <SelectValue placeholder="Выберите тариф" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                          {tariffs.map((tariff) => (
                            <SelectItem key={tariff.id} value={tariff.id} className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-md">
                              {tariff.name} — {tariff.price} сом ({tariff.speedLimit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Блок 2: Адресные данные */}
            <div className="space-y-4 border-b border-zinc-800/60 pb-6">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500">
                Геолокация объекта
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Населенный пункт (Село)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Кара-Суу"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.village ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Адрес (Улица, дом)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ул. Центральная, д. 12"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.address ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Блок 3: Сетевые инженерные параметры (Необязательно) */}
            <div className="space-y-4 pb-2">
              <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-500">
                Инженерно-сетевые параметры (Опционально)
              </h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="ipAddress"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Статический IP-адрес
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="192.168.1.101"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.ipAddress ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] tracking-wider text-zinc-500 uppercase">
                        Пусто для динамического IP
                      </FormDescription>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="macAddress"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        MAC-адрес роутера
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="AA:BB:CC:DD:EE:FF"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.macAddress ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] tracking-wider text-zinc-500 uppercase">
                        Формат: AA:BB:CC:DD:EE:FF
                      </FormDescription>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="speedLimit"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Персональный лимит скорости
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="50M/50M"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.speedLimit ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] tracking-wider text-zinc-500 uppercase">
                        Переопределяет дефолтную скорость тарифа
                      </FormDescription>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mikrotikComment"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-bold">
                        Комментарий для MikroTik
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="id-канал-001"
                          disabled={isPending}
                          className={`bg-zinc-950/40 border-zinc-800 text-zinc-100 placeholder-zinc-700 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide ${form.formState.errors.mikrotikComment ? 'border-red-650' : 'border-zinc-800'}`}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] tracking-wider text-zinc-500 uppercase">
                        Идентификатор для скриптов
                      </FormDescription>
                      <FormMessage className="text-xs text-red-400 font-medium tracking-wide mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 border-t border-zinc-800/60 p-6 pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/subscribers')}
              className="border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 font-bold uppercase tracking-[0.2em] text-xs h-11 px-6 rounded-lg cursor-pointer transition-all"
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-[0.2em] text-xs h-11 px-6 rounded-lg cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Сохранение...</span>
                </>
              ) : (
                <span>Создать абонента</span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

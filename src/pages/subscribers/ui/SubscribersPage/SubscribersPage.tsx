import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribersQuery, useUpdateSubscriberStatusMutation, type Subscriber } from '@/entities/subscriber';
import { 
  Search, UserPlus, MapPin, Wifi, WifiOff, AlertCircle, Loader2, RefreshCw, Power,
  ChevronDown, Globe, User, Key, Phone, Zap, Calendar, Gauge, Network, Wallet, Send, Copy, Check 
} from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

// Кастомный хук копирования для ячеек сетки
function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(fieldId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  return { copiedId, copy };
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export const SubscribersPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: subscribers = [], isLoading, isError, refetch, isFetching } = useSubscribersQuery();
  const statusMutation = useUpdateSubscriberStatusMutation();
  const { copiedId, copy } = useCopyToClipboard();

  // Состояния фильтрации и раскрытия строки
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Получаем роль администратора
  const adminData = localStorage.getItem('admin_user');
  const admin = adminData ? JSON.parse(adminData) : { role: 'TECHNICIAN' };
  const isSuperAdmin = admin.role === 'SUPER_ADMIN';

  // Вытаскиваем уникальный список сел из базы для динамического фильтра
  const villages = ['ALL', ...new Set(subscribers.map(sub => sub.village))];

  // Логика фильтрации таблицы
  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = 
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.paymentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm);
      
    const matchesVillage = selectedVillage === 'ALL' || sub.village === selectedVillage;

    return matchesSearch && matchesVillage;
  });

  const totalColumns = isSuperAdmin ? 8 : 7;

  // Хелпер рендеринга бэйджа статуса на основе SubscriberStatus из схемы Prisma
  const renderStatusBadge = (status: Subscriber['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 gap-1 rounded-full px-2 py-0.5">
            <Wifi className="h-3 w-3" /> Активен
          </Badge>
        );
      case 'SUSPENDED':
        return (
          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10 gap-1 rounded-full px-2 py-0.5">
            <WifiOff className="h-3 w-3" /> Блокирован
          </Badge>
        );
      case 'GRACE':
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10 gap-1 rounded-full px-2 py-0.5">
            <AlertCircle className="h-3 w-3" /> Grace
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <div className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            Загрузка реестра абонентов...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto relative z-10">
      
      {/* Шапка страницы */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-5 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Реестр Абонентов</h1>
          <p className="text-neutral-400 text-sm">Управление договорами, балансами и статусами в сети Starlink</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isLoading || isFetching}
            className="flex items-center gap-2 border-neutral-800 hover:bg-neutral-900 text-neutral-300 font-bold uppercase tracking-wider text-xs h-10 px-4 rounded-lg cursor-pointer transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${(isLoading || isFetching) ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          {isSuperAdmin && (
            <Button 
              onClick={() => navigate('/subscribers/create')}
              className="bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs h-10 px-4 rounded-lg cursor-pointer transition-all active:scale-[0.99] gap-2"
            >
              <UserPlus className="h-4 w-4" /> Добавить абонента
            </Button>
          )}
        </div>
      </div>

      {/* Панель фильтров */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 backdrop-blur-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Поиск по ФИО, коду Finik или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-zinc-800 bg-zinc-950/40 text-zinc-50 focus:border-white focus:ring-0 focus-visible:ring-0 focus-visible:border-white rounded-lg h-11 text-sm tracking-wide"
          />
        </div>
        
        <div className="w-full sm:w-64 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-zinc-500 hidden sm:block shrink-0" />
          <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="border-zinc-800 bg-zinc-950/40 text-zinc-50 rounded-lg h-11">
              <SelectValue placeholder="Все села" />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
              {villages.map((village) => (
                <SelectItem key={village} value={village} className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-md">
                  {village === 'ALL' ? 'Все населенные пункты' : `с. ${village}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Таблица данных */}
      {isError ? (
        <div className="rounded-xl bg-red-950/20 border border-red-900/30 p-4 text-sm text-red-400 uppercase tracking-wider font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>Не удалось загрузить список абонентов. Проверьте подключение к серверу.</span>
          <Button onClick={() => refetch()} size="sm" variant="outline" className="ml-auto border-red-900/50 hover:bg-red-950/40 text-red-400 rounded-lg">
            Повторить
          </Button>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <Card className="border-zinc-800 bg-zinc-900/20 border-dashed p-12 text-center rounded-xl backdrop-blur-md">
          <CardContent className="space-y-2">
            <p className="text-zinc-400 uppercase tracking-wider text-xs font-bold">
              Совпадений по заданным фильтрам не обнаружено
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-md shadow-2xl">
          <Table>
            <TableHeader className="bg-zinc-950/50 border-b border-zinc-850">
              <TableRow className="border-b border-zinc-850 hover:bg-transparent">
                <TableHead className="w-[150px] text-zinc-400 font-bold uppercase tracking-wider text-[10px] pl-6">Код Finik</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">ФИО Абонента</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Телефон</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Локация</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Тарифный план</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] text-right">Баланс</TableHead>
                <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] text-center pr-6">Доступ</TableHead>
                {isSuperAdmin && (
                  <TableHead className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] text-center pr-6">Действия</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((sub) => {
                const isExpanded = expandedId === sub.id;
                return (
                  <React.Fragment key={sub.id}>
                    <TableRow 
                      className={cn(
                        "border-b border-zinc-850 transition-colors cursor-pointer",
                        isExpanded ? "bg-zinc-900/40" : "hover:bg-zinc-800/10"
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    >
                      <TableCell className="font-mono font-bold text-zinc-100 pl-6 text-sm">
                        <div className="flex items-center gap-2">
                          <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200 shrink-0", isExpanded && "transform rotate-180")} />
                          {sub.paymentCode}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-zinc-200">{sub.fullName}</TableCell>
                      <TableCell className="text-zinc-400 font-mono text-xs">{sub.phone}</TableCell>
                      <TableCell className="text-zinc-400 text-sm">с. {sub.village}</TableCell>
                      <TableCell className="text-zinc-350">
                        <Badge variant="outline" className="border-zinc-800 bg-zinc-950/60 text-zinc-300 rounded-md">
                          {sub.tariff.name}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-bold font-mono text-sm ${sub.balance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sub.balance.toLocaleString()} сом
                      </TableCell>
                      <TableCell className="text-center pr-6">{renderStatusBadge(sub.status)}</TableCell>
                      {isSuperAdmin && (
                        <TableCell className="text-center pr-6">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={statusMutation.isPending}
                            onClick={(e) => {
                              e.stopPropagation();
                              statusMutation.mutate({
                                subscriberId: sub.id,
                                status: sub.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED',
                              });
                            }}
                            className={`gap-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold h-8 px-3 cursor-pointer transition-all ${
                              sub.status === 'SUSPENDED'
                                ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
                            }`}
                          >
                            {statusMutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Power className="h-3 w-3" />
                            )}
                            {sub.status === 'SUSPENDED' ? 'Включить' : 'Отключить'}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                    
                    {/* РАСКРЫВАЕМАЯ ИНЛАЙН-ПАНЕЛЬ ДЕТАЛИЗАЦИИ */}
                    <TableRow className="hover:bg-transparent border-b border-zinc-850 p-0">
                      <TableCell colSpan={totalColumns} className="p-0">
                        <div 
                          className={cn(
                            "grid transition-all duration-300 ease-in-out bg-zinc-950/20",
                            isExpanded ? "grid-rows-[1fr] border-b border-zinc-850" : "grid-rows-[0fr]"
                          )}
                        >
                          <div className="overflow-hidden min-h-0">
                            <div className="p-6 space-y-6 bg-zinc-950/40 backdrop-blur-md text-zinc-200">
                              
                              {/* Сетка данных 3х4 */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                
                                {/* 1. PPPoE Логин */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">PPPoE Логин</span>
                                  <div className="flex items-center gap-2 font-mono text-sm text-zinc-100 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full justify-between h-10 px-3">
                                    <div className="flex items-center gap-2 truncate">
                                      <User className="h-4 w-4 text-zinc-500 shrink-0" />
                                      <span className="truncate">{sub.radiusUsername || '—'}</span>
                                    </div>
                                    {sub.radiusUsername && (
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); copy(sub.radiusUsername!, `${sub.id}-username`); }}
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
                                      >
                                        {copiedId === `${sub.id}-username` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* 2. PPPoE Пароль */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">PPPoE Пароль</span>
                                  <div className="flex items-center gap-2 font-mono text-sm text-zinc-100 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full justify-between h-10 px-3">
                                    <div className="flex items-center gap-2 truncate">
                                      <Key className="h-4 w-4 text-zinc-500 shrink-0" />
                                      <span className="truncate">{sub.radiusPassword || '—'}</span>
                                    </div>
                                    {sub.radiusPassword && (
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); copy(sub.radiusPassword!, `${sub.id}-password`); }}
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
                                      >
                                        {copiedId === `${sub.id}-password` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* 3. IP-Адрес */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">IP-Адрес</span>
                                  <div className="flex items-center gap-2 font-mono text-sm text-zinc-100 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full justify-between h-10 px-3">
                                    <div className="flex items-center gap-2 truncate">
                                      <Globe className="h-4 w-4 text-zinc-500 shrink-0" />
                                      <span className="truncate">{sub.ipAddress || '—'}</span>
                                    </div>
                                    {sub.ipAddress && (
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); copy(sub.ipAddress!, `${sub.id}-ip`); }}
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
                                      >
                                        {copiedId === `${sub.id}-ip` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* 4. MAC-Адрес */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">MAC-Адрес</span>
                                  <div className="flex items-center gap-2 font-mono text-sm text-zinc-100 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full justify-between h-10 px-3">
                                    <div className="flex items-center gap-2 truncate">
                                      <Network className="h-4 w-4 text-zinc-500 shrink-0" />
                                      <span className="truncate">{sub.macAddress || '—'}</span>
                                    </div>
                                    {sub.macAddress && (
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); copy(sub.macAddress!, `${sub.id}-mac`); }}
                                        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
                                      >
                                        {copiedId === `${sub.id}-mac` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* 5. Тарифный план */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Тарифный план</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                                    <span className="truncate">{sub.tariff.name} ({sub.tariff.price.toLocaleString()} сом)</span>
                                  </div>
                                </div>

                                {/* 6. Скорость */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Скорость доступа</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Gauge className="h-4 w-4 text-sky-400 shrink-0" />
                                    <span className="truncate">{sub.speedLimit || sub.tariff.speedLimit} Мбит/с</span>
                                  </div>
                                </div>

                                {/* 7. Текущий Баланс */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Текущий Баланс</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Wallet className="h-4 w-4 text-emerald-400 shrink-0" />
                                    <span className={cn("truncate font-bold font-mono", sub.balance < 0 ? "text-rose-400" : "text-emerald-400")}>
                                      {sub.balance.toLocaleString()} сом
                                    </span>
                                  </div>
                                </div>

                                {/* 8. День списания */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">День списания</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                                    <span className="truncate">{sub.billingDay}-е число месяца</span>
                                  </div>
                                </div>

                                {/* 9. Телефон */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Телефон абонента</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                                    <span className="truncate font-mono">{sub.phone}</span>
                                  </div>
                                </div>

                                {/* 10. Локация */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Адрес подключения</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                                    <span className="truncate">с. {sub.village}, {sub.address}</span>
                                  </div>
                                </div>

                                {/* 11. Telegram ЛК */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Telegram ЛК</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Send className={cn("h-4 w-4 shrink-0", sub.telegramId ? "text-sky-400" : "text-zinc-600")} />
                                    <span className="truncate">
                                      {sub.telegramId 
                                        ? (sub.telegramUsername ? `@${sub.telegramUsername}` : `ID: ${sub.telegramId}`) 
                                        : 'Не авторизован'}
                                    </span>
                                  </div>
                                </div>

                                {/* 12. Дата подключения */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">Дата подключения</span>
                                  <div className="flex items-center gap-2 text-sm text-zinc-200 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 w-full h-10 px-3">
                                    <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
                                    <span className="truncate">{formatDate(sub.createdAt)}</span>
                                  </div>
                                </div>

                              </div>

                              {/* НИЖНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ (СТРОГО ДЛЯ SUPER_ADMIN) */}
                              {isSuperAdmin && (
                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-zinc-900/80">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const creds = `Логин: ${sub.radiusUsername || '—'}\nПароль: ${sub.radiusPassword || '—'}`;
                                      copy(creds, `${sub.id}-all`);
                                    }}
                                    className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-850 text-xs h-9 px-4 cursor-pointer transition-all active:scale-[0.98]"
                                  >
                                    {copiedId === `${sub.id}-all` ? (
                                      <Check className="h-3.5 w-3.5 text-emerald-400 mr-1.5 shrink-0" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                    )}
                                    {copiedId === `${sub.id}-all` ? 'Данные скопированы!' : 'Копировать все PPPoE-данные'}
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant={sub.status === 'SUSPENDED' ? 'default' : 'destructive'}
                                    disabled={statusMutation.isPending}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const nextStatus = sub.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
                                      statusMutation.mutate({ subscriberId: sub.id, status: nextStatus });
                                    }}
                                    className={`text-xs h-9 cursor-pointer transition-all active:scale-[0.98] ${
                                      sub.status === 'SUSPENDED'
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                                        : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500'
                                    }`}
                                  >
                                    {statusMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5 shrink-0" />
                                    ) : (
                                      <Power className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                    )}
                                    {sub.status === 'SUSPENDED' ? 'Активировать доступ' : 'Заблокировать доступ'}
                                  </Button>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

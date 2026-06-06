import React, { useState } from 'react';
import {
  useSubscribersQuery,
  useUpdateSubscriberStatusMutation,
  SubscriberStatusBadge,
  type Subscriber,
} from '@/entities/subscriber';
import { useAdmin } from '@/entities/admin';
import { AlertCircle, Loader2, Power, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { Header } from '@/widgets/header';
import { SubscriberFilters } from '@/features/subscriber-filters';
import { SubscriberDetailPanel } from '@/widgets/subscriber-detail-panel';

export const SubscribersPage: React.FC = () => {
  const { data: subscribers = [], isLoading, isError, refetch, isFetching } =
    useSubscribersQuery();
  const statusMutation = useUpdateSubscriberStatusMutation();
  const admin = useAdmin();
  const isSuperAdmin = admin.role === 'SUPER_ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const villages = ['ALL', ...new Set(subscribers.map((sub: Subscriber) => sub.village))];

  const filteredSubscribers = subscribers.filter((sub: Subscriber) => {
    const matchesSearch =
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.paymentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phone.includes(searchTerm);
    const matchesVillage = selectedVillage === 'ALL' || sub.village === selectedVillage;
    return matchesSearch && matchesVillage;
  });

  const totalColumns = isSuperAdmin ? 8 : 7;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <div className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Загрузка реестра абонентов...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1760px] mx-auto relative z-10">
      <Header
        title="Реестр Абонентов"
        subtitle="Управление договорами, балансами и статусами в сети Starlink"
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <SubscriberFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedVillage={selectedVillage}
        onVillageChange={setSelectedVillage}
        villages={villages}
      />

      {isError ? (
        <div className="rounded-xl bg-red-950/20 border border-red-900/30 p-4 text-sm text-red-400 uppercase tracking-wider font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>Не удалось загрузить список абонентов. Проверьте подключение к серверу.</span>
          <Button
            onClick={() => refetch()}
            size="sm"
            variant="outline"
            className="ml-auto border-red-900/50 hover:bg-red-950/40 text-red-400 rounded-lg"
          >
            Повторить
          </Button>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <Card className="border-border bg-card/20 border-dashed p-12 text-center rounded-xl backdrop-blur-md">
          <CardContent className="space-y-2">
            <p className="text-muted-foreground uppercase tracking-wider text-xs font-bold">
              Совпадений по заданным фильтрам не обнаружено
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden backdrop-blur-md shadow-2xl">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="w-[150px] text-muted-foreground font-bold uppercase tracking-wider text-[10px] pl-6">
                  Код Finik
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  ФИО Абонента
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  Телефон
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  Локация
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  Тарифный план
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] text-right">
                  Баланс
                </TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] text-center pr-6">
                  Доступ
                </TableHead>
                {isSuperAdmin && (
                  <TableHead className="text-muted-foreground font-bold uppercase tracking-wider text-[10px] text-center pr-6">
                    Действия
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((sub: Subscriber) => {
                const isExpanded = expandedId === sub.id;
                return (
                  <React.Fragment key={sub.id}>
                    <TableRow
                      className={cn(
                        'border-b border-border transition-colors cursor-pointer',
                        isExpanded ? 'bg-muted/65' : 'hover:bg-muted/30',
                      )}
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                    >
                      <TableCell className="font-mono font-bold text-foreground pl-6 text-sm">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0',
                              isExpanded && 'transform rotate-180',
                            )}
                          />
                          {sub.paymentCode}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{sub.fullName}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {sub.phone}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        с. {sub.village}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Badge
                          variant="outline"
                          className="border-border bg-background/60 text-foreground rounded-md"
                        >
                          {sub.tariff.name}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-bold font-mono text-sm',
                          sub.balance < 0 ? 'text-destructive' : 'text-success',
                        )}
                      >
                        {sub.balance.toLocaleString()} сом
                      </TableCell>
                      <TableCell className="text-center pr-6">
                        <SubscriberStatusBadge status={sub.status} />
                      </TableCell>
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
                            className={cn(
                              'gap-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold h-8 px-3 cursor-pointer transition-all',
                              sub.status === 'SUSPENDED'
                                ? 'border-success/30 text-success hover:bg-success/10'
                                : 'border-destructive/30 text-destructive hover:bg-destructive/10',
                            )}
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
                    <TableRow className="hover:bg-transparent border-b border-border p-0">
                      <TableCell colSpan={totalColumns} className="p-0">
                        <SubscriberDetailPanel
                          subscriber={sub}
                          isExpanded={isExpanded}
                          isSuperAdmin={isSuperAdmin}
                          isPending={statusMutation.isPending}
                          onStatusToggle={(id, status) =>
                            statusMutation.mutate({ subscriberId: id, status })
                          }
                        />
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

import React from 'react';
import {
  Globe,
  User,
  Key,
  Phone,
  Zap,
  Calendar,
  Gauge,
  Network,
  Wallet,
  Send,
  Copy,
  Check,
  Power,
  Loader2,
  MapPin,
} from 'lucide-react';
import type { Subscriber } from '@/entities/subscriber';
import { useCopyToClipboard } from '@/shared/lib/useCopyToClipboard';
import { formatDate, cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

// ---------------------------------------------------------------------------
// Internal sub-components (не экспортируются из слайса)
// ---------------------------------------------------------------------------

interface CopyableFieldProps {
  label: string;
  value: string | undefined | null;
  icon: React.ReactNode;
  copyId: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

const CopyableField: React.FC<CopyableFieldProps> = ({
  label,
  value,
  icon,
  copyId,
  copiedId,
  onCopy,
}) => (
  <div className="space-y-1">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
      {label}
    </span>
    <div className="flex items-center gap-2 font-mono text-sm text-foreground bg-card/50 p-2 rounded border border-border/50 w-full justify-between h-10 px-3">
      <div className="flex items-center gap-2 truncate">
        {icon}
        <span className="truncate">{value || '—'}</span>
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(value, copyId);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
        >
          {copiedId === copyId ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  </div>
);

interface StaticFieldProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const StaticField: React.FC<StaticFieldProps> = ({ label, value, icon }) => (
  <div className="space-y-1">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
      {label}
    </span>
    <div className="flex items-center gap-2 text-sm text-foreground bg-card/50 p-2 rounded border border-border/50 w-full h-10 px-3">
      {icon}
      <span className="truncate">{value}</span>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface SubscriberDetailPanelProps {
  subscriber: Subscriber;
  isExpanded: boolean;
  isSuperAdmin: boolean;
  isPending: boolean;
  onStatusToggle: (subscriberId: string, nextStatus: 'ACTIVE' | 'SUSPENDED') => void;
}

export const SubscriberDetailPanel: React.FC<SubscriberDetailPanelProps> = ({
  subscriber: sub,
  isExpanded,
  isSuperAdmin,
  isPending,
  onStatusToggle,
}) => {
  const { copiedId, copy } = useCopyToClipboard();

  return (
    <div
      className={cn(
        'grid transition-all duration-300 ease-in-out bg-background/20',
        isExpanded ? 'grid-rows-[1fr] border-b border-border' : 'grid-rows-[0fr]',
      )}
    >
      <div className="overflow-hidden min-h-0">
        <div className="p-6 space-y-6 bg-background/40 backdrop-blur-md text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CopyableField
              label="PPPoE Логин"
              value={sub.radiusUsername}
              icon={<User className="h-4 w-4 text-muted-foreground shrink-0" />}
              copyId={`${sub.id}-username`}
              copiedId={copiedId}
              onCopy={copy}
            />
            <CopyableField
              label="PPPoE Пароль"
              value={sub.radiusPassword}
              icon={<Key className="h-4 w-4 text-muted-foreground shrink-0" />}
              copyId={`${sub.id}-password`}
              copiedId={copiedId}
              onCopy={copy}
            />
            <CopyableField
              label="IP-Адрес"
              value={sub.ipAddress}
              icon={<Globe className="h-4 w-4 text-muted-foreground shrink-0" />}
              copyId={`${sub.id}-ip`}
              copiedId={copiedId}
              onCopy={copy}
            />
            <CopyableField
              label="MAC-Адрес"
              value={sub.macAddress}
              icon={<Network className="h-4 w-4 text-muted-foreground shrink-0" />}
              copyId={`${sub.id}-mac`}
              copiedId={copiedId}
              onCopy={copy}
            />
            <StaticField
              label="Тарифный план"
              value={`${sub.tariff.name} (${sub.tariff.price.toLocaleString()} сом)`}
              icon={<Zap className="h-4 w-4 text-amber-400 shrink-0" />}
            />
            <StaticField
              label="Скорость доступа"
              value={`${sub.speedLimit ?? sub.tariff.speedLimit} Мбит/с`}
              icon={<Gauge className="h-4 w-4 text-sky-400 shrink-0" />}
            />
            <StaticField
              label="Текущий Баланс"
              value={
                <span
                  className={cn(
                    'font-bold font-mono',
                    sub.balance < 0 ? 'text-destructive' : 'text-success',
                  )}
                >
                  {sub.balance.toLocaleString()} сом
                </span>
              }
              icon={<Wallet className="h-4 w-4 text-emerald-400 shrink-0" />}
            />
            <StaticField
              label="День списания"
              value={`${sub.billingDay}-е число месяца`}
              icon={<Calendar className="h-4 w-4 text-purple-400 shrink-0" />}
            />
            <StaticField
              label="Телефон абонента"
              value={<span className="font-mono">{sub.phone}</span>}
              icon={<Phone className="h-4 w-4 text-muted-foreground shrink-0" />}
            />
            <StaticField
              label="Адрес подключения"
              value={`с. ${sub.village}, ${sub.address}`}
              icon={<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />}
            />
            <StaticField
              label="Telegram ЛК"
              value={
                sub.telegramId
                  ? sub.telegramUsername
                    ? `@${sub.telegramUsername}`
                    : `ID: ${sub.telegramId}`
                  : 'Не авторизован'
              }
              icon={
                <Send
                  className={cn(
                    'h-4 w-4 shrink-0',
                    sub.telegramId ? 'text-sky-400' : 'text-zinc-500',
                  )}
                />
              }
            />
            <StaticField
              label="Дата подключения"
              value={formatDate(sub.createdAt)}
              icon={<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />}
            />
          </div>

          {isSuperAdmin && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  const creds = `Логин: ${sub.radiusUsername ?? '—'}\nПароль: ${sub.radiusPassword ?? '—'}`;
                  copy(creds, `${sub.id}-all`);
                }}
                className="border-border bg-background text-foreground hover:bg-muted text-xs h-9 px-4 cursor-pointer transition-all active:scale-[0.98]"
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
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusToggle(
                    sub.id,
                    sub.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED',
                  );
                }}
                className={cn(
                  'text-xs h-9 cursor-pointer transition-all active:scale-[0.98]',
                  sub.status === 'SUSPENDED'
                    ? 'bg-success hover:bg-success/90 text-primary-foreground border-success'
                    : 'bg-destructive hover:bg-destructive/90 text-primary-foreground border-destructive',
                )}
              >
                {isPending ? (
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
  );
};

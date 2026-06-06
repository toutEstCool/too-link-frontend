import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface SubscriberFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedVillage: string;
  onVillageChange: (value: string) => void;
  villages: string[];
}

export const SubscriberFilters: React.FC<SubscriberFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedVillage,
  onVillageChange,
  villages,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-xl border border-border backdrop-blur-md">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по ФИО, коду Finik или телефону..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-border bg-background/40 text-foreground placeholder-muted-foreground/50 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:border-primary rounded-lg h-11 text-sm tracking-wide"
        />
      </div>

      <div className="w-full sm:w-64 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground hidden sm:block shrink-0" />
        <Select value={selectedVillage} onValueChange={onVillageChange}>
          <SelectTrigger className="border-border bg-background/40 text-foreground rounded-lg h-11">
            <SelectValue placeholder="Все села" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card text-foreground">
            {villages.map((village) => (
              <SelectItem
                key={village}
                value={village}
                className="focus:bg-muted focus:text-foreground cursor-pointer rounded-md"
              >
                {village === 'ALL' ? 'Все населенные пункты' : `с. ${village}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

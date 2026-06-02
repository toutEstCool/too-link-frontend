import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CreateSubscriberForm } from '@/features/create-subscriber';

export const CreateSubscriberPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto relative z-10">
      {/* Кнопка возврата */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-50 hover:bg-neutral-900 gap-2 text-xs uppercase tracking-wider font-bold h-10 px-4 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" /> Назад
        </Button>
        <h1 className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase font-bold">
          Контур регистрации
        </h1>
      </div>

      <CreateSubscriberForm />
    </div>
  );
};

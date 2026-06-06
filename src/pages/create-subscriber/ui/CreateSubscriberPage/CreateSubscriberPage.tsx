import React from 'react';
import { CreateSubscriberForm } from '@/features/create-subscriber';

export const CreateSubscriberPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1760px] mx-auto relative z-10">
      <CreateSubscriberForm />
    </div>
  );
};

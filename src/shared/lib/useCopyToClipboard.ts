import { useState } from 'react';

interface UseCopyToClipboardReturn {
  copiedId: string | null;
  copy: (text: string, id: string) => Promise<void>;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (text: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return { copiedId, copy };
}

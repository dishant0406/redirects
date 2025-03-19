import React from 'react';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface DomainStatusBadgeProps {
  status: DomainStatus | null;
  isLoading?: boolean;
}

export const DomainStatusBadge: React.FC<DomainStatusBadgeProps> = ({ status, isLoading }) => {
  if (isLoading || !status) {
    return (
      <span className="inline-flex shadow-custom items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs md:text-sm">
        <Loader2 className="animate-spin" size={14} />
        <span>Checking...</span>
      </span>
    );
  }

  if (status.status.success) {
    return (
      <span className="inline-flex  shadow-custom items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs md:text-sm">
        <CheckCircle2 size={14} />
        <span>Verified</span>
      </span>
    );
  }

  return (
    <span className="inline-flex  shadow-custom items-center gap-2 px-3 py-1 rounded-full bg-destructive/20 text-destructive-foreground text-xs md:text-sm">
      <AlertCircle size={14} />
      <span>Pending</span>
    </span>
  );
};

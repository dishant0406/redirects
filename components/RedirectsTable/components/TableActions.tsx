import React from 'react';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export interface TableAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
}

export const TableActions: React.FC<TableActionsProps> = ({ actions }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40 p-1">
        <div className="space-y-0.5">
          {actions.map((action, index) => (
            <React.Fragment key={action.label}>
              <Button
                className="w-full justify-start gap-2 px-2 text-sm"
                disabled={action.disabled}
                variant={action.variant || 'ghost'}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
              >
                {action.icon}
                {action.label}
              </Button>
              {index < actions.length - 1 && <Separator className="my-1" />}
            </React.Fragment>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

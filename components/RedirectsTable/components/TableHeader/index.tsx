import React from 'react';

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ onSelectAll }) => {
  return (
    <thead className="bg-muted/50 hidden md:table-header-group">
      <tr>
        <th className="w-[48px] p-4">
          <input
            className="rounded bg-muted border-border focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            type="checkbox"
            onChange={(e) => onSelectAll?.(e.target.checked)}
          />
        </th>
        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Domain</th>
        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Status</th>
        <th className="w-[48px] p-4"></th>
      </tr>
    </thead>
  );
};

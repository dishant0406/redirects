'use client';

import { RedirectRow } from './components/RedirectRow';
import { TableHeader } from './components/TableHeader';

interface RedirectsTableProps {
  redirects: Redirect[];
  onSelect?: (ids: string[]) => void;
  onRedirectClick?: ((redirect: Redirect) => void) | undefined;
}

const RedirectsTable = ({ redirects, onSelect, onRedirectClick }: RedirectsTableProps) => {
  return (
    <div className="bg-background rounded-lg overflow-hidden">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHeader />
            <tbody className="divide-y divide-border">
              {redirects.map((redirect) => (
                <RedirectRow
                  key={redirect._id}
                  redirect={redirect}
                  onRedirectClick={(redirect) => onRedirectClick && onRedirectClick(redirect)}
                  onSelect={(ids) => onSelect && onSelect(ids)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RedirectsTable;

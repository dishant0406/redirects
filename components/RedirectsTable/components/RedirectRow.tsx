'use client';
import React, { useEffect, useState } from 'react';

import { ChevronDown, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { CreateRedirectModal } from '@/components/Micro/CreateRedirect';
import { deleteRedirect, verifyStatus } from '@/lib/api';
import { formatUrl } from '@/lib/helpers';
import { promiseToast } from '@/lib/toast';
import useRedirectStore from '@/lib/zustand';

import { DnsInstructions } from './DnsInstructions';
import { DomainStatusBadge } from './DomainStatusBadge';
import { TableActions } from './TableActions';

import type { TableAction } from './TableActions';

interface RedirectRowProps {
  redirect: Redirect;
  onSelect?: (ids: string[]) => void;
  onRedirectClick?: (redirect: Redirect) => void;
}

export const RedirectRow: React.FC<RedirectRowProps> = ({
  redirect,
  onSelect,
  onRedirectClick,
}) => {
  const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchRedirects } = useRedirectStore();

  const tableActions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => setIsOpen(true),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => {
        promiseToast(deleteRedirect(redirect._id), 'Redirect deleted successfully', {
          errorMessage: 'Error deleting redirect',
          onSuccess: fetchRedirects,
          setLoading: setIsDeleting,
        });
      },
      variant: 'destructive',
      disabled: isDeleting,
    },
  ];

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await verifyStatus(redirect.fromDomain);
      setDomainStatus(response.data);
      setIsLoading(false);
      return response.data.status.success;
    } catch (error) {
      console.error('Error fetching status:', error);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [redirect]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPolling && !domainStatus?.status.success) {
      interval = setInterval(async () => {
        const success = await fetchStatus();
        if (success) {
          setIsPolling(false);
        }
      }, 5000); // Poll every 30 seconds
    } else if (isPolling && domainStatus?.status.success) {
      interval = setInterval(async () => {
        const success = await fetchStatus();
        if (!success) {
          setIsPolling(false);
        }
      }, 30000); // Poll every 30 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPolling, domainStatus]);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    // if (!isPolling) {
    //   setIsPolling(true);
    // } else if (!newIsExpanded) {
    //   setIsPolling(false);
    // }
  };

  return (
    <>
      <tr
        className="group transition-colors hover:bg-muted/50 "
        onClick={() => onRedirectClick?.(redirect)}
      >
        <td className="p-4">
          <input
            className="rounded bg-muted border-border focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            type="checkbox"
            onChange={(e) => onSelect?.(e.target.checked ? [redirect._id] : [])}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="p-4">
          <div className="space-y-1.5">
            <Link
              className="font-medium text-foreground"
              href={formatUrl(redirect.fromDomain).formattedUrl}
              target="_blank"
            >
              {redirect.fromDomain}
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ExternalLink
                className="cursor-pointer hover:scale-110 transition-transform"
                size={14}
                onClick={() => {
                  window.open(formatUrl(redirect.toDomain).formattedUrl, '_blank');
                }}
              />
              {redirect.toDomain}
            </div>
          </div>
        </td>
        <td className="p-4 text-right">
          <DomainStatusBadge isLoading={isLoading} status={domainStatus} />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <TableActions actions={tableActions} />
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleExpandClick}
            >
              <ChevronDown
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                size={16}
              />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && domainStatus && (
        <tr className="bg-muted/30">
          <td className="p-6" colSpan={4}>
            <DnsInstructions isPolling={isPolling} status={domainStatus} />
          </td>
        </tr>
      )}
      <CreateRedirectModal isOpen={isOpen} redirect={redirect} setIsOpen={setIsOpen} />
    </>
  );
};

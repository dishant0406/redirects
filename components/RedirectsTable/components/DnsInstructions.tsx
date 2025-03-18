import React from 'react';

import { Loader2, Lock, ShieldCheck } from 'lucide-react';

interface DnsInstructionsProps {
  status: DomainStatus;
  isPolling: boolean;
}

export const DnsInstructions: React.FC<DnsInstructionsProps> = ({ status, isPolling }) => {
  if (status.status.success) {
    return (
      <div className="space-y-6 max-w-full">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <ShieldCheck className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-foreground font-medium mb-2">{status.status.title}</h3>
              <p className="text-muted-foreground">{status.status.summary}</p>
              {status.status.detail && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  {status.status.certificateStatus === 'pending' ? (
                    <>
                      <Loader2 className="animate-spin text-accent-foreground" size={14} />
                      <span className="text-accent-foreground">{status.status.detail}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="text-accent-foreground" size={14} />
                      <span className="text-accent-foreground">
                        SSL certificate is active and protecting your domain
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 text-sm text-muted-foreground border border-border">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">DNS Configuration</h4>
            <div className="flex flex-col mt-2 gap-2">
              <div>
                <span className="text-muted-foreground">Record Type:</span>
                <span className="text-foreground ml-2">{status.dnsRecords.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Value:</span>
                <span className="text-foreground ml-2">{status.dnsRecords.addresses[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <h3 className="text-destructive font-medium mb-2">{status.status.title}</h3>
        <p className="text-muted-foreground">{status.status.summary}</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Required DNS Record</h4>
        <div className="bg-card rounded-lg p-4 mt-2 font-mono text-sm border border-border">
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="text-foreground ml-2">{status.required?.recordType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Value:</span>
              <span className="text-foreground ml-2">{status.required?.value}</span>
            </div>
          </div>
        </div>
      </div>

      {status.instructions && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">{status.instructions.title}</h4>
          <ol className="space-y-3">
            {status.instructions.steps.map((step) => (
              <li key={step.step} className="flex items-start gap-3 text-muted-foreground">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {step.step}
                </span>
                {step.description}
              </li>
            ))}
          </ol>
        </div>
      )}

      {status.support && (
        <div className="bg-card rounded-lg p-4 text-sm text-muted-foreground border border-border">
          <p>{status.support.additionalInfo}</p>
          <p className="mt-2">
            Need help?{' '}
            <a
              className="text-primary hover:text-primary/80 transition-colors"
              href={`mailto:${status.support.contactEmail}`}
              onClick={(e) => e.stopPropagation()}
            >
              Contact support
            </a>
          </p>
        </div>
      )}

      {isPolling && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={14} />
          Checking DNS records every 5 seconds...
        </div>
      )}
    </div>
  );
};

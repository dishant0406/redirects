'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends Omit<React.ComponentProps<'input'>, 'prefix'> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  startText?: string;
  endText?: string;
  onStartClick?: () => void;
  onEndClick?: () => void;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startIcon, endIcon, startText, endText, onStartClick, onEndClick, ...props },
    ref
  ) => {
    const startRef = React.useRef<HTMLDivElement>(null);
    const endRef = React.useRef<HTMLDivElement>(null);
    const [startWidth, setStartWidth] = React.useState(0);
    const [endWidth, setEndWidth] = React.useState(0);

    React.useEffect(() => {
      if (startRef.current) {
        setStartWidth(startRef.current.getBoundingClientRect().width);
      }
      if (endRef.current) {
        setEndWidth(endRef.current.getBoundingClientRect().width);
      }
    }, [startText, endText, startIcon, endIcon]);

    return (
      <div className={cn('relative inline-flex w-full', className)}>
        {/* Start Element */}
        {(startIcon || startText) && (
          <div
            ref={startRef}
            className={cn(
              'absolute left-0 h-full flex items-center justify-center px-3 text-muted-foreground',
              onStartClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onStartClick}
          >
            {startIcon}
            {startText && <span className="text-sm">{startText}</span>}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            startWidth > 0 && `pl-[${startWidth + 8}px]`,
            endWidth > 0 && `pr-[${endWidth + 8}px]`
          )}
          style={{
            paddingLeft: startWidth ? `${startWidth + 8}px` : undefined,
            paddingRight: endWidth ? `${endWidth + 8}px` : undefined,
          }}
          type={type}
          {...props}
        />

        {/* End Element */}
        {(endIcon || endText) && (
          <div
            ref={endRef}
            className={cn(
              'absolute right-0 h-full flex items-center justify-center px-3 text-muted-foreground',
              onEndClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onEndClick}
          >
            {endText && <span className="text-sm">{endText}</span>}
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

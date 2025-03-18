'use client';

import { AxiosError } from 'axios';
import { CircleCheck, InfoIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster, toast } from 'sonner';

export const successToast = (message: string) => {
  toast.success(message, {
    icon: <CircleCheck className="w-6 h-6 text-primary" />,
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    icon: <InfoIcon className="w-6 h-6 text-primary" />,
  });
};

type PromiseOptions<T> = {
  loadingText?: string;
  errorMessage?: string;
  setLoading?: (loading: boolean) => void;
  final?: () => void;
  onSuccess?: (data: T) => void;
};

export const promiseToast = async <T,>(
  promise: Promise<T>,
  successMessage?: string,
  promiseOptions?: PromiseOptions<T>
): Promise<T | { data: null }> => {
  const {
    loadingText = 'Loading...',
    errorMessage = 'Something went wrong',
    setLoading,
    final,
    onSuccess,
  } = promiseOptions || {
    loadingText: 'Loading...',
    errorMessage: 'Something went wrong',
  };

  try {
    setLoading?.(true);

    if (successMessage) {
      await toast.promise(promise, {
        loading: loadingText,
        success: (data) => {
          onSuccess?.(data);
          return successMessage;
        },
        error: (error) => {
          if (error instanceof AxiosError) {
            return (
              error.response?.data?.message ||
              error.response?.data?.error ||
              error.response?.data?.toString() ||
              error.message ||
              errorMessage
            );
          } else if (error instanceof Error) {
            return error.message || errorMessage;
          } else if (typeof error === 'string') {
            return error;
          }
          return errorMessage;
        },
        finally: () => {
          setLoading?.(false);
          final?.();
        },
      });
      const data = await promise;
      onSuccess?.(data);
      return data;
    }

    const data = await promise;
    onSuccess?.(data);
    return data;
  } catch (error: unknown) {
    let message: string;

    if (error instanceof AxiosError) {
      message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : '') ||
        error.message ||
        errorMessage;
    } else if (error instanceof Error) {
      message = error.message || errorMessage;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = errorMessage;
    }

    errorToast(message.toString());
    return {
      data: null,
    };
  } finally {
    setLoading?.(false);
    final?.();
  }
};

export const Toaster = (props: React.ComponentProps<typeof SonnerToaster>) => {
  const { theme } = useTheme();

  return (
    <SonnerToaster position="bottom-right" theme={theme === 'dark' ? 'dark' : 'light'} {...props} />
  );
};

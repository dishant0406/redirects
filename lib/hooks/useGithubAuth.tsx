'use client';

import { useCallback, useEffect, useState } from 'react';

interface OAuthConfig {
  clientUrl: string;
  width?: number;
  height?: number;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

interface OAuthState {
  isLoading: boolean;
  error: Error | null;
  token: string | null;
}

export const useGithubOAuth = ({
  clientUrl,
  width = 500,
  height = 600,
  onSuccess,
  onError,
}: OAuthConfig) => {
  const [state, setState] = useState<OAuthState>({
    isLoading: false,
    error: null,
    token: null,
  });

  // Cleanup function for event listener
  const cleanup = useCallback(() => {
    window.removeEventListener('message', handleMessage);
  }, []);

  // Handle incoming messages from popup
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Verify origin matches your backend URL
      if (event.origin !== new URL(clientUrl).origin) {
        return;
      }

      try {
        const { jwt, error } = event.data;

        if (error) {
          throw new Error(error);
        }

        if (jwt) {
          setState((prev) => ({ ...prev, token: jwt, isLoading: false }));
          onSuccess?.(jwt);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'OAuth failed';
        setState((prev) => ({
          ...prev,
          error: new Error(errorMessage),
          isLoading: false,
        }));
        onError?.(new Error(errorMessage));
      }
    },
    [clientUrl, onSuccess, onError]
  );

  // Initialize OAuth flow
  const initiateOAuth = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Calculate center position for popup
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      // Secure popup options
      const options = {
        width,
        height,
        left,
        top,
        location: 'no',
        toolbar: 'no',
        status: 'no',
        directories: 'no',
        menubar: 'no',
        scrollbars: 'yes',
        resizable: 'no',
        centerscreen: 'yes',
      };

      const optionsString = Object.entries(options)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');

      // Add state parameter for CSRF protection
      const state = crypto.getRandomValues(new Uint8Array(16)).join('');
      sessionStorage.setItem('oauth_state', state);

      const oauthUrl = new URL(clientUrl);
      oauthUrl.searchParams.append('state', state);

      // Open popup and add event listener
      const popup = window.open(oauthUrl.toString(), 'Github OAuth', optionsString);

      if (!popup) {
        throw new Error('Failed to open OAuth popup. Please enable popups for this site.');
      }

      window.addEventListener('message', handleMessage);

      // Check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          cleanup();
          clearInterval(checkClosed);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: new Error('Authentication cancelled'),
          }));
        }
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate OAuth';
      setState((prev) => ({
        ...prev,
        error: new Error(errorMessage),
        isLoading: false,
      }));
      onError?.(new Error(errorMessage));
    }
  }, [width, height, clientUrl, handleMessage, cleanup, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    initiateOAuth,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,
  };
};

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
      try {
        const { jwt, error, state: receivedState } = event.data;

        // Verify state parameter matches
        const savedState = sessionStorage.getItem('oauth_state');
        if (receivedState !== savedState) {
          throw new Error('Invalid state parameter');
        }

        if (error) {
          throw new Error(error);
        }

        if (jwt) {
          // Clear state after successful authentication
          sessionStorage.removeItem('oauth_state');
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
    [onSuccess, onError]
  );

  // Initialize OAuth flow
  const initiateOAuth = useCallback(
    (frontendUrl: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Verify frontend URL is valid
        const frontendOrigin = new URL(frontendUrl).origin;

        // Add event listener that validates message origin
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== frontendOrigin) {
            console.warn(`Invalid origin: ${event.origin}. Expected: ${frontendOrigin}`);
            return;
          }
          handleMessage(event);
        };

        window.addEventListener('message', messageHandler);

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
        const state = Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        sessionStorage.setItem('oauth_state', state);

        // Add frontend URL and state to OAuth URL
        const oauthUrl = new URL(clientUrl);
        oauthUrl.searchParams.append('state', state);
        oauthUrl.searchParams.append('redirect_uri', frontendUrl);

        // Open popup and add event listener
        const popup = window.open(oauthUrl.toString(), 'Github OAuth', optionsString);

        if (!popup) {
          throw new Error('Failed to open OAuth popup. Please enable popups for this site.');
        }

        // Check if popup was closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            window.removeEventListener('message', messageHandler);
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
    },
    [width, height, clientUrl, handleMessage, onError]
  );

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

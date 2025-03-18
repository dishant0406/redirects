import { useEffect, useState } from 'react';

interface UserData {
  email: string | null;
  id: string | null;
}

interface LoginState extends UserData {
  isLoggedIn: boolean;
}

/**
 * Custom hook to check if user is logged in by decoding base64 encoded user details
 * @returns {LoginState} Object containing login status and user data
 */
const useIsLoggedIn = (): LoginState => {
  const [loginState, setLoginState] = useState<LoginState>({
    isLoggedIn: false,
    id: null,
    email: null,
  });

  useEffect(() => {
    try {
      // Get the body element
      const bodyElement = document.body;

      // Get the encoded data
      const encodedData = bodyElement.getAttribute('data-body');

      if (encodedData) {
        // Decode the base64 string
        const decodedData = atob(encodedData);

        // Parse the JSON
        const userData = JSON.parse(decodedData) as UserData;

        // Check if both email and id exist
        if (userData.email && userData.id) {
          setLoginState({
            isLoggedIn: true,
            id: userData.id,
            email: userData.email,
          });
        } else {
          setLoginState({
            isLoggedIn: false,
            id: null,
            email: null,
          });
        }
      }
    } catch (error) {
      console.error('Error decoding user data:', error);
      setLoginState({
        isLoggedIn: false,
        id: null,
        email: null,
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  return loginState;
};

export default useIsLoggedIn;

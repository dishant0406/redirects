import Cookies from 'js-cookie';

/* eslint-disable @typescript-eslint/no-explicit-any */
const decodeJWT = (
  token: string
): {
  header: any;
  payload: any;
  signature: string;
} => {
  // Split the token into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token format');
  }

  // Base64Url decode function
  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    let padded = str;
    while (padded.length % 4) {
      padded += '=';
    }

    // Replace URL-safe characters
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');

    // Decode and convert to UTF-8 string
    try {
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      throw new Error('Failed to decode base64url string');
    }
  };

  try {
    // Decode header and payload
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return {
      header,
      payload,
      signature: parts[2],
    };
  } catch {
    throw new Error('Failed to parse JWT token');
  }
};

export const getUserData = async (
  propsToken?: string
): Promise<{
  isAuthenticated: boolean;
  user: User | null;
}> => {
  const token = propsToken || Cookies.get('token') || '';

  if (!token)
    return {
      isAuthenticated: false,
      user: null,
    };

  const { payload } = decodeJWT(token);

  return {
    isAuthenticated: true,
    user: payload,
  };
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trimStringValues = (data: any): any => {
  if (typeof data === 'string') return data.trim();
  if (Array.isArray(data)) return data.map(trimStringValues);
  if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        [key]: trimStringValues(data[key]),
      }),
      {}
    );
  }
  return data;
};

/**
 * Formats a URL to ensure HTTPS and parses its components
 * @param url - The URL string to format and parse
 * @returns An object containing the formatted URL and its components
 */
export const formatUrl = (
  url: string
): {
  formattedUrl: string;
  domain: string;
  path: string;
  query: Record<string, string>;
  queryString: string;
  params: string[];
} => {
  // Trim whitespace
  let trimmedUrl = url.trim();

  // Add protocol if missing
  if (!trimmedUrl.match(/^https?:\/\//i)) {
    trimmedUrl = `https://${trimmedUrl}`;
  }

  // Replace http with https
  trimmedUrl = trimmedUrl.replace(/^http:/i, 'https:');

  try {
    // Parse URL
    const urlObj = new URL(trimmedUrl);

    // Extract domain (hostname)
    const domain = urlObj.hostname;

    // Extract path
    const path = urlObj.pathname;

    // Extract query parameters as object
    const query: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    // Extract query string without the leading '?'
    const queryString = urlObj.search.replace(/^\?/, '');

    // Extract path parameters
    const params = path.split('/').filter((segment) => segment.length > 0);

    return {
      formattedUrl: urlObj.toString(),
      domain,
      path,
      query,
      queryString,
      params,
    };
  } catch {
    return {
      formattedUrl: '',
      domain: '',
      path: '',
      query: {},
      queryString: '',
      params: [],
    };
  }
};

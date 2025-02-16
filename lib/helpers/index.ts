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

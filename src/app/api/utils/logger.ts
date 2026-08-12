// Simple structured logger for server-side use
export const info = (message: string, meta?: any) => {
  const out = { level: 'info', message, timestamp: new Date().toISOString(), meta: meta || null };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(out));
};

export const warn = (message: string, meta?: any) => {
  const out = { level: 'warn', message, timestamp: new Date().toISOString(), meta: meta || null };
  // eslint-disable-next-line no-console
  console.warn(JSON.stringify(out));
};

export const error = (message: string, meta?: any) => {
  const out = { level: 'error', message, timestamp: new Date().toISOString(), meta: meta || null };
  // eslint-disable-next-line no-console
  console.error(JSON.stringify(out));
};

/* eslint-disable no-console */
const logger = {
  log: (...args) => import.meta.env.DEV && console.log(...args),
  warn: (...args) => import.meta.env.DEV && console.warn(...args),
  error: (...args) => import.meta.env.DEV && console.error(...args),
};

export default logger;

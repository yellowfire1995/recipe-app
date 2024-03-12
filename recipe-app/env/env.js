const env = import.meta.env;

export const server = env.VITE_SERVER_HOST;
export const auth0Domain = env.VITE_DOMAIN;
export const auth0Redirect = env.VITE_REDIRECT_URI;
export const auth0ClientId = env.VITE_CLIENT_ID;
export const auth0Audience = env.VITE_AUDIENCE;

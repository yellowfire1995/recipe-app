import { useAuth0 } from "@auth0/auth0-react";

export async function getConfig() {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return config;
}

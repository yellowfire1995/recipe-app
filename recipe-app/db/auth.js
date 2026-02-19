export async function getConfig({ getAccessTokenSilently }) {
  const token = await getAccessTokenSilently();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return config;
}

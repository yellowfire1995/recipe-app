export async function getToken(page) {
  const token = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    const auth0Keys = keys.filter((k) => k.startsWith("@@auth0spajs@@"));

    for (const key of auth0Keys) {
      try {
        const session = JSON.parse(localStorage.getItem(key));
        const accessToken = session?.body?.access_token;
        const expiresAt = session?.expiresAt;

        if (!accessToken) continue;

        // expiresAt is a unix timestamp in seconds
        const isExpired = expiresAt && Date.now() / 1000 > expiresAt;
        if (isExpired) continue;

        return accessToken;
      } catch {
        continue;
      }
    }

    return null;
  });

  if (!token) {
    throw new Error(
      "No valid Auth0 token found — session may be expired. Delete tests/.auth/session.json and re-run to log in again.",
    );
  }

  return token;
}

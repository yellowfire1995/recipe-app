import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Callback() {
  const { handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      const { appState } = await handleRedirectCallback();
      navigate(appState?.returnTo || "/", { replace: true });
    };
    processCallback();
  }, [handleRedirectCallback, navigate]);

  return <div>Redirecting...</div>;
}

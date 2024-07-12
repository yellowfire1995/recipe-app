import { useAuth0 } from "@auth0/auth0-react";

export function RecipeHeaderButtons({ children }) {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <></>;
  }

  return <div className="d-flex gap-1">{children}</div>;
}

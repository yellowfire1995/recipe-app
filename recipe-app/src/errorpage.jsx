import { useRouteError } from "react-router-dom";
import Header from "./Components/Header";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

export default function ErrorPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const error = useRouteError();
  console.error(error);
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated ? (
    <>
      <Header />
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}

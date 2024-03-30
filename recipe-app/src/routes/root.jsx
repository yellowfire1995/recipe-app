import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../Components/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Components/Loading.jsx";
import useLocalStorage from "use-local-storage";

export async function action({ params, request }) {
  return redirect(`/`);
}

export default function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // const query = useQuery({
  //   queryKey: [`AccessToken`],
  //   queryFn: addAccessTokenInterceptor(getAccessTokenSilently),
  // });

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      addAccessTokenInterceptor(getAccessTokenSilently);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  // if (query.isLoading) {
  //   return (
  //     <div>
  //       <Row className="">
  //         <Header />
  //       </Row>
  //       <Container className="pt-3">
  //         <Row>
  //           <Loading />
  //         </Row>
  //       </Container>
  //     </div>
  //   );
  // }

  return (
    <>
      <Header switchTheme={switchTheme} currentTheme={theme} />

      <Outlet />
    </>
  );
}

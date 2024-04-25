import React from "react";

import Header from "../Components/Header.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

import { addAccessTokenInterceptor } from "../../db/axiosConfig.js";

export async function action({ params, request }) {
  return redirect(`/`);
}

export default function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // const query = useQuery({
  //   queryKey: [`AccessToken`],
  //   queryFn: addAccessTokenInterceptor(getAccessTokenSilently),
  // });

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
      <Header />

      <Outlet />
    </>
  );
}

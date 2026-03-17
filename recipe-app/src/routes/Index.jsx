import { Navigate } from "react-router-dom";

export default function Index() {
  Navigate({ to: "/recipes" });
  return (
    <>
      <title>CookbookCalc</title>

      {/* <FrontPageHero /> */}
    </>
  );
}

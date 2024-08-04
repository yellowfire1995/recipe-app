import { Helmet } from "react-helmet-async";
import { FrontPageHero } from "../Components/FrontPage/Hero";

export default function Index() {
  return (
    <>
      <Helmet>
        <title>CookbookCalc</title>
      </Helmet>

      <FrontPageHero />
    </>
  );
}

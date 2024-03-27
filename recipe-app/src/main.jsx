import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import RecipeCards from "./Components/RecipeCards.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import ErrorPage from "./errorpage";
import { action as filterAction } from "./routes/root.jsx";
import Recipe from "./routes/Recipes.jsx";
import Edit from "./routes/edit.jsx";
import Ingredients from "./routes/ingredients.jsx";
import NewRecipe from "./routes/newrecipe.jsx";
import ImportRecipe from "./routes/import.jsx";
import Login from "./routes/login.jsx";
import SignUp from "./routes/signup.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import Profile from "./routes/profile.jsx";
import MyRecipes from "./routes/MyRecipes.jsx";
import {
  auth0Audience,
  auth0ClientId,
  auth0Domain,
  auth0Redirect,
} from "../env/env.js";
import AllRecipes from "./routes/AllRecipes.jsx";
import Index from "./routes/Index.jsx";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        action: filterAction,
        children: [
          { index: true, element: <Index /> },
          {
            path: "recipes",
            element: <AllRecipes />,
          },
          {
            element: <MyRecipes />,
            path: "myrecipes",
          },
          {
            element: <Recipe />,
            path: "recipes/:recipeId",
          },
          {
            element: <Edit />,
            path: "/recipes/:recipeId/edit",
          },
          {
            element: <Ingredients />,
            path: "/ingredients",
          },
          {
            element: <NewRecipe />,
            path: "/newrecipe",
          },
          {
            element: <ImportRecipe />,
            path: "/importrecipe",
          },
          {
            element: <Profile />,
            path: "/profile",
          },
        ],
      },
    ],
  },
  {
    element: <Login />,
    path: "/login",
    errorElement: <ErrorPage />,
  },
  {
    element: <SignUp />,
    path: "/signup",
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          cacheLocation={"localstorage"}
          authorizationParams={{
            redirect_uri: auth0Redirect,
            audience: auth0Audience,
            scope: "read:current_user update:current_user_metadata",
          }}
        >
          <RouterProvider router={router} />
        </Auth0Provider>
      </QueryClientProvider>
    </React.StrictMode>
  </div>
);

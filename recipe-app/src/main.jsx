import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ErrorPage from "./errorpage";
import { action as filterAction } from "./routes/root.jsx";
import Recipe from "./routes/Recipes.jsx";
import Edit from "./routes/edit.jsx";
import Ingredients from "./routes/ingredients.jsx";
import AddRecipe from "./routes/import.jsx";
import Login from "./routes/login.jsx";
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
import Collections from "./routes/Collections.jsx";
import "./index.scss";
import ErrorHandler from "./Components/Errors/NotFound.jsx";
export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    errorElement: <ErrorPage />,
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
            path: "collections",
            element: <Collections />,
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
            element: <AddRecipe />,
            path: "/newrecipe",
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
            scope:
              "read:current_user update:current_user_metadata profile email",
          }}
        >
          <RouterProvider router={router} />
        </Auth0Provider>
      </QueryClientProvider>
    </React.StrictMode>
  </div>
);

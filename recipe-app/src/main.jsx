import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Root from "./routes/Root.jsx";

import { Auth0Provider } from "@auth0/auth0-react";
import {
  auth0Audience,
  auth0ClientId,
  auth0Domain,
  auth0Redirect,
} from "../env/env.js";
import RouteErrorPage from "./Components/Errors/RouteErrorPage.jsx";
import "./index.scss";
import AddRecipe from "./routes/AddRecipe.jsx";
import AllRecipes from "./routes/AllRecipes.jsx";
import CollectionRecipesPage from "./routes/Collections.jsx";
import { ContactPage } from "./routes/Contact.jsx";
import Edit from "./routes/Edit.jsx";
import Index from "./routes/Index.jsx";
import Ingredients from "./routes/Ingredients.jsx";
import Login from "./routes/Login.jsx";
import MyCollections from "./routes/MyCollections.jsx";
import MyRecipes from "./routes/MyRecipes.jsx";
import Planner from "./routes/Planner.jsx";
import Profile from "./routes/Profile.jsx";
import Recipe from "./routes/Recipes.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <ContactPage />,
        path: "contact",
      },
      {
        element: <Recipe />,
        path: "recipes/:recipeId",
      },

      {
        path: "recipes",
        element: <AllRecipes />,
      },
      { index: true, element: <Index /> },
      {
        element: <PrivateRoutes />,
        children: [
          { path: "planner", element: <Planner /> },

          {
            path: "collections",
            element: <MyCollections />,
          },
          {
            path: "collections/:collectionId",
            element: <CollectionRecipesPage />,
          },
          {
            element: <MyRecipes />,
            path: "myrecipes",
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
    errorElement: <RouteErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <React.StrictMode>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        cacheLocation="localstorage"
        authorizationParams={{
          redirect_uri: auth0Redirect,
          audience: auth0Audience,
          scope: "read:current_user update:current_user_metadata profile email",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Auth0Provider>
    </React.StrictMode>
  </div>,
);

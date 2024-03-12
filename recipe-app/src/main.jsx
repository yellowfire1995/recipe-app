import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import RecipeCards, {
  loader as recipeCardsLoader,
} from "./Components/RecipeCards.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import ErrorPage from "./errorpage";
import { action as filterAction } from "./routes/root.jsx";
import Recipe, { loader as RecipeLoader } from "./routes/Recipes.jsx";
import { action as recipeCardsAction } from "./Components/RecipeCards.jsx";
import Edit, {
  loader as editLoader,
  action as editAction,
} from "./routes/edit.jsx";
import Ingredients from "./routes/ingredients.jsx";
import NewRecipe from "./routes/newrecipe.jsx";
import ImportRecipe from "./routes/import.jsx";
import Login from "./routes/login.jsx";
import SignUp from "./routes/signup.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import Profile from "./routes/profile.jsx";
import MyRecipes, { loader as myRecipesLoader } from "./routes/myrecipes.jsx";
import {
  auth0Audience,
  auth0ClientId,
  auth0Domain,
  auth0Redirect,
} from "../env/env.js";

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
          {
            index: true,
            element: <RecipeCards />,
            loader: recipeCardsLoader,
            errorElement: <ErrorPage />,
            action: recipeCardsAction,
          },
          {
            element: <RecipeCards />,
            path: "myrecipes",
            loader: myRecipesLoader,
          },
          {
            element: <Recipe />,
            path: "recipes/:recipeId",
            loader: RecipeLoader,
            errorElement: <ErrorPage />,
          },
          {
            element: <Edit />,
            path: "/recipes/:recipeId/edit",
            errorElement: <ErrorPage />,
            loader: editLoader,
            action: editAction,
          },
          {
            element: <Ingredients />,
            path: "/ingredients",
            errorElement: <ErrorPage />,
          },
          {
            element: <NewRecipe />,
            path: "/newrecipe",
            errorElement: <ErrorPage />,
          },
          {
            element: <ImportRecipe />,
            path: "/importrecipe",
            errorElement: <ErrorPage />,
          },
          {
            element: <Profile />,
            path: "/profile",
            errorElement: <ErrorPage />,
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

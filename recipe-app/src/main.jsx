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
import { AuthProvider } from "./utils/useAuth.jsx";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  </div>
);

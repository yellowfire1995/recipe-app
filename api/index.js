import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

import newRecipeRoute from "./routes/Private Routes/Recipes/Import/newrecipe.js";
import ingredientsRoute from "./routes/Private Routes/Recipes/ingredients.js";
import editRoute from "./routes/Private Routes/Recipes/Edit/edit.js";
import recipeCardsRoute from "./routes/Public Routes/recipecards.js";
import recipesRoute from "./routes/Public Routes/recipes.js";
import cuisineRouter from "./routes/Private Routes/Recipes/cuisines.js";
import categoryRouter from "./routes/Private Routes/Recipes/categories.js";
import importDirectionsRoute from "./routes/Private Routes/Recipes/Import/directions.js";
import importIngredientsRoute from "./routes/Private Routes/Recipes/Import/ingredients.js";
import auth0Route from "./routes/Private Routes/Auth/auth0.js";
import myRecipesRoute from "./routes/Private Routes/Recipes/myrecipes.js";
import getPriceRoute from "./routes/Private Routes/Recipes/Scrape/getprice.js";
import scrapeRecipeRoute from "./routes/Private Routes/Recipes/Scrape/scrapeRecipe.js";
import collectionsRoute from "./routes/Private Routes/UserLists/collections.js";
import plannerRoute from "./routes/Private Routes/UserLists/planner.js";
import { errorHandler } from "./tools/error/errorHandler.js";
import contactRoute from "./routes/Public Routes/contact.js";
import RatingRoute from "./routes/Private Routes/Recipes/Rating/rating.js";

const ENV = process.env;
const app = express();
const port = ENV.SERVER_PORT;
export const authenticate = auth({
  audience: [process.env.AUTH0_AUDIENCE, process.env.AUTH0_VERIFY],
  issuerBaseURL: process.env.AUTH0_BASEURL,
});

var whitelist = [ENV.HOST];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(express.static("public"));

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use("/recipecards", recipeCardsRoute);
app.use("/recipes", recipesRoute);
app.use("/contact", contactRoute);

app.use(authenticate);

app.use("/import", importDirectionsRoute);
app.use("/import", importIngredientsRoute);
app.use("/import", scrapeRecipeRoute);
app.use("/categories", categoryRouter);
app.use("/cuisines", cuisineRouter);
app.use("/newrecipe", newRecipeRoute);
app.use("/ingredients", ingredientsRoute);
app.use("/edit", editRoute);
app.use("/profile", auth0Route);
app.use("/myrecipes", myRecipesRoute);
app.use("/getprice", getPriceRoute);
app.use("/collections", collectionsRoute);
app.use("/planner", plannerRoute);
app.use("/rating", RatingRoute);

app.use(errorHandler);

app.listen(port, ENV.SERVER_HOST, () => {
  console.log(`Server is running on port ${port}`);
});

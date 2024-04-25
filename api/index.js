import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import nutritionRoute from "./routes/specific recipes/nutrition.js";
import newRecipeRoute from "./routes/specific recipes/newrecipe.js";
import ingredientsRoute from "./routes/specific recipes/ingredients.js";
import editRoute from "./routes/specific recipes/edit.js";
import recipeCardsRoute from "./routes/all recipes/recipecards.js";
import recipesRoute from "./routes/specific recipes/recipes.js";
import cuisineRouter from "./routes/all recipes/cuisines.js";
import categoryRouter from "./routes/all recipes/categories.js";
import sidebarCuisinesRoute from "./routes/all recipes/sidebarcuisines.js";
import importDirectionsRoute from "./routes/import/directions.js";
import importIngredientsRoute from "./routes/import/ingredients.js";
import auth0Route from "./routes/auth/auth0.js";
import myRecipesRoute from "./routes/specific recipes/myrecipes.js";
import getPriceRoute from "./routes/specific recipes/getprice.js";
import scrapeRecipeRoute from "./routes/import/scrapeRecipe.js";
import uploadPhotoRoute from "./routes/specific recipes/photos.js";

const ENV = process.env;
const app = express();
const port = ENV.SERVER_PORT;

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

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

app.use("/nutrition", nutritionRoute);
app.use("/newrecipe", newRecipeRoute);
app.use("/ingredients", ingredientsRoute);
app.use("/edit", editRoute);
app.use("/recipecards", recipeCardsRoute);
app.use("/recipes", recipesRoute);
app.use("/categories", categoryRouter);
app.use("/cuisines", cuisineRouter);
app.use("/sidebarcuisines", sidebarCuisinesRoute);
app.use("/import", importDirectionsRoute);
app.use("/import", importIngredientsRoute);
app.use("/import", scrapeRecipeRoute);
app.use("/profile", auth0Route);
app.use("/myrecipes", myRecipesRoute);
app.use("/getPrice", getPriceRoute);
app.use("/photo/upload", uploadPhotoRoute);

app.listen(port, ENV.SERVER_HOST, () => {
  console.log(`Server is running on port ${port}`);
});

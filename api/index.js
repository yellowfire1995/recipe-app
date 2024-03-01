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
import authRoute from "./routes/auth/auth.js";
import importDirectionsRoute from "./routes/import/directions.js";
import importIngredientsRoute from "./routes/import/ingredients.js";
import passport from "passport";
import session from "express-session";
import "dotenv/config";

const _ = process.env;
const app = express();
const port = _.SERVER_PORT;

app.use(cors());

app.use(bodyParser.json());

app.use(
  session({
    secret: _.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 24 * 1000 }, //1 day
  })
);
app.use(passport.authenticate("session"));

app.use("/nutrition", nutritionRoute);
app.use("/newrecipe", newRecipeRoute);
app.use("/ingredients", ingredientsRoute);
app.use("/edit", editRoute);
app.use("/recipecards", recipeCardsRoute);
app.use("/recipes", recipesRoute);
app.use("/categories", categoryRouter);
app.use("/cuisines", cuisineRouter);
app.use("/sidebarcuisines", sidebarCuisinesRoute);
app.use("/", authRoute);
app.use("/import", importDirectionsRoute);
app.use("/import", importIngredientsRoute);

app.listen(port, _.SERVER_HOST, () => {
  console.log(`Server is running on port ${port}`);
});

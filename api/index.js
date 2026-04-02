import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

import auth0Route from "./routes/Private Routes/Auth/auth0.js";
import cuisineRouter from "./routes/Private Routes/Recipes/cuisines.js";
import editRoute from "./routes/Private Routes/Recipes/Edit/edit.js";
import importDirectionsRoute from "./routes/Private Routes/Recipes/Import/directions.js";
import importIngredientsRoute from "./routes/Private Routes/Recipes/Import/ingredients.js";
import newRecipeRoute from "./routes/Private Routes/Recipes/Import/newrecipe.js";
import importPhotoRoute from "./routes/Private Routes/Recipes/Import/photoimport.js";
import ingredientsRoute from "./routes/Private Routes/Recipes/ingredients.js";
import myRecipesRoute from "./routes/Private Routes/Recipes/myrecipes.js";
import RatingRoute from "./routes/Private Routes/Recipes/Rating/rating.js";
import getPriceRoute from "./routes/Private Routes/Recipes/Scrape/getprice.js";
import scrapeRecipeRoute from "./routes/Private Routes/Recipes/Scrape/scrapeRecipe.js";
import collectionsRoute from "./routes/Private Routes/UserLists/collections.js";
import plannerRoute from "./routes/Private Routes/UserLists/planner.js";
import categoryRouter from "./routes/Public Routes/categories.js";
import contactRoute from "./routes/Public Routes/contact.js";
import publicCollections from "./routes/Public Routes/publiccollections.js";
import recipeCardsRoute from "./routes/Public Routes/recipecards.js";
import recipesRoute from "./routes/Public Routes/recipes.js";
import { errorHandler } from "./tools/error/errorHandler.js";

const ENV = process.env;
const app = express();
const port = ENV.SERVER_PORT;
export const authenticate = auth({
  audience: [process.env.AUTH0_AUDIENCE, process.env.AUTH0_VERIFY],
  issuerBaseURL: process.env.AUTH0_BASEURL,
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 60,
  skip: () => process.env.NODE_ENV !== "production",
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

const whitelist = ENV.HOST?.split(",").map((s) => s.trim()) || [];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (same-origin requests from reverse proxy)
    if (!origin) {
      return callback(null, true);
    }

    // Allow whitelisted origins
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Apply the rate limiting middleware to all requests.
app.set("trust proxy", 1);
app.use(limiter);

app.use(express.static("public"));

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());

app.use("/recipecards", recipeCardsRoute);
app.use("/recipes", recipesRoute);
app.use("/contact", contactRoute);
app.use("/categories", categoryRouter);
app.use("/publiccollections", publicCollections);

app.use(authenticate);

app.use("/import", importDirectionsRoute);
app.use("/import", importIngredientsRoute);
app.use("/import", scrapeRecipeRoute);
app.use("/photoimport", importPhotoRoute);
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

import httpClient from "./axiosConfig";
import { server } from "../env/env.js";

//Get category list for new recipe page
export async function getCategories() {
  try {
    const categoryList = await httpClient.get(`${server}/categories`);
    return categoryList.data[0].categories;
  } catch (error) {
    console.log(error);
  }
}

//Get cuisine list for new recipe page
export async function getCuisines() {
  try {
    const cuisineList = await httpClient.get(`${server}/cuisines`);
    return cuisineList.data[0].cuisines;
  } catch (error) {
    console.log(error);
  }
}

//Delete recipe from recipe page
export async function deleteRecipe(recipeId, recipe) {
  try {
    const deletedRecipe = await httpClient.delete(
      `${server}/recipes/${recipeId}/delete`,
      { data: recipe }
    );

    console.log(deletedRecipe);
  } catch (error) {
    console.error(error);
  }
}

//Edit Recipe
export async function editRecipe(e, updatedRecipe) {
  e.preventDefault();
  try {
    const formData = new FormData();
    if (updatedRecipe.imgFile) {
      formData.append("photo", updatedRecipe.imgFile);
    }

    formData.append("updatedRecipe", JSON.stringify(updatedRecipe));
    const { data } = await httpClient.post(`${server}/edit`, formData);
    return data;
  } catch (err) {
    console.error(1, err);
  }
}

//Create new recipe and return recipe ID created
export async function newRecipe(updatedRecipe) {
  try {
    const formData = new FormData();
    if (updatedRecipe.imgFile) {
      formData.append("photo", updatedRecipe.imgFile);
    }

    formData.append("updatedRecipe", JSON.stringify(updatedRecipe));

    const response = await httpClient.post(`${server}/newrecipe`, formData);
    return response.data.recipe_id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//Save price info from popup modal on recipe page
export async function savePrice(pkgGrms, pkgCost, url, fdc_id) {
  try {
    const { data } = await httpClient.post(`${server}/ingredients/price`, {
      pkgGrms: pkgGrms,
      pkgCost: pkgCost,
      url: url,
      fdc_id: fdc_id,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

//Return search results from editable ingredient list
export async function ingredientSearch(e, search) {
  e.preventDefault();
  try {
    const listIngredients = await httpClient.post(
      `${server}/ingredients/search`,
      { ingredient: search },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(listIngredients.data);
    return listIngredients.data;
  } catch (error) {
    console.error(error);
  }
}

//Import page get directions as array
export async function parseDirections(directions) {
  try {
    const directionsArray = await httpClient.post(
      `${server}/import/directions`,
      { directions: directions },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return directionsArray.data;
  } catch (error) {
    console.error(error);
  }
}

//Import page get ingredients as array
export async function parseIngredients(ingredients) {
  try {
    const ingredientsArray = await httpClient.post(
      `${server}/import/ingredients`,
      { ingredients: ingredients },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return ingredientsArray.data;
  } catch (error) {
    console.error(error);
  }
}

//Get recipe by id using URL parameter
export async function getRecipeById(recipeId) {
  try {
    const recipe = await httpClient.get(`${server}/recipes/${recipeId}`);
    return recipe.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Get all recipes for recipe cards on home page
export async function getRecipeCards({ page, search }) {
  try {
    const recipeCards = await httpClient.get(
      `${server}/recipecards?page=${page}&search=${search}`
    );

    return recipeCards.data;
  } catch (error) {
    console.log(error);
    return Promise.reject(404);
  }
}

//Get all recipes for recipe cards on home page
export async function getMyRecipeCards({ page, search }) {
  try {
    const recipeCards = await httpClient.get(
      `${server}/myrecipes?page=${page}&search=${search}`
    );
    return recipeCards.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

//Get recipes by day for planner
export async function getMealPlan() {
  try {
    const mealPlanRecipes = await httpClient.get(`${server}/planner/recipes`);

    return mealPlanRecipes.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

export async function addToMeallPlan(recipeId, date) {
  try {
    const mealPlanRecipes = await httpClient.post(
      `${server}/planner/add/recipe/${recipeId}`,
      { date: date }
    );

    return mealPlanRecipes.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

export async function deleteFromMealPlan(planId) {
  try {
    console.log(planId);
    const deletedMealPlanRecipe = await httpClient.delete(
      `${server}/planner/delete/${planId}`
    );

    return deletedMealPlanRecipe.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

export async function changeMealDay(planId, date) {
  try {
    const mealPlanRecipes = await httpClient.post(`${server}/planner/edit`, {
      date: date,
      planId: planId,
    });

    return mealPlanRecipes.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

//Get recipes by collection
export async function getCollectionRecipes() {
  try {
    const collectionRecipes = await httpClient.get(
      `${server}/collections/recipes`
    );

    return collectionRecipes.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

//Get collections for user
export async function getCollectionNames() {
  try {
    const collectionNames = await httpClient.get(`${server}/collections/names`);
    console.log(collectionNames.data);
    return collectionNames.data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

//Add recipe to collection
export async function addRecipeToCollection(recipeId, collection) {
  try {
    console.log(recipeId);
    const { data } = await httpClient.post(
      `${server}/collections/add/recipe/${recipeId}`,
      { collection: collection }
    );
    return data;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

export async function deleteCollection(collection) {
  try {
    const deleteCollection = await httpClient.delete(
      `${server}/collections/delete/collection/${collection.id}`
    );
    return deleteCollection;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

export async function deleteCollectionRecipe(arrayOfRecipes) {
  try {
    const arrayOfIds = arrayOfRecipes.map((recipe) => recipe.key);
    console.log(arrayOfIds);
    const deleteCollectionRecipe = await httpClient.delete(
      `${server}/collections/delete/recipe`,
      { data: { ids: arrayOfIds } }
    );
    return deleteCollectionRecipe;
  } catch (error) {
    console.log("ERROR!");
    return Promise.reject(401);
  }
}

//Get all cuisines for sidebar filter list
export async function getSidebarCuisines() {
  try {
    const sidebarCuisines = await httpClient.get(`${server}/sidebarcuisines`);

    return sidebarCuisines.data;
  } catch (error) {
    console.error(error);
  }
}

//Get nutrition info for recipes page

export async function getNutritionInfo(recipeId) {
  try {
    const nutritionInfo = await httpClient.get(
      `${server}/nutrition/${recipeId}`
    );

    return nutritionInfo.data[0];
  } catch (error) {
    console.error(error);
  }
}

//Get recipe data from url
export async function scrapeRecipe(url) {
  try {
    const recipe = await httpClient.post(
      `${server}/import/scrape`,
      { url: url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(recipe);
    return recipe.data;
  } catch (error) {
    console.error(error);
  }
}

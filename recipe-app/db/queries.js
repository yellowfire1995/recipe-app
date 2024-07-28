import httpClient from "./axiosConfig";
import { server } from "../env/env.js";

//Get category list for new recipe page
export async function getCategories() {
  try {
    const categoryList = await httpClient.get(`${server}/categories`);
    return categoryList.data[0].categories;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get cuisine list for new recipe page
export async function getCuisines() {
  try {
    const cuisineList = await httpClient.get(`${server}/cuisines`);
    return cuisineList.data[0].cuisines;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Delete recipe from recipe page
export async function deleteRecipe(recipeId, recipe) {
  try {
    await httpClient.delete(`${server}/recipes/${recipeId}/delete`, {
      data: recipe,
    });
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Edit Recipe
export async function editRecipe({ e, recipe }) {
  e.preventDefault();
  console.log(recipe);
  try {
    const formData = new FormData();
    if (recipe.imgFile) {
      formData.append("photo", recipe.imgFile);
    }

    formData.append("recipe", JSON.stringify(recipe));
    const { data } = await httpClient.post(`${server}/edit`, formData);
    return data;
  } catch (error) {
    return Promise.reject(error.response);
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
    console.log(response.data);
    return response.data.recipeId;
  } catch (error) {
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
  }
}

export async function getPrice(url) {
  try {
    console.log(url);
    const { data } = await httpClient.post(`${server}/getprice`, { url });
    return data;
  } catch (error) {
    return Promise.reject(error.response);
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

    return listIngredients.data;
  } catch (error) {
    return Promise.reject(error.response);
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
    console.log(directionsArray.data);
    return directionsArray.data;
  } catch (error) {
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
  }
}

//Get recipe by id using URL parameter
export async function getRecipeById(recipeId) {
  try {
    const recipe = await httpClient.get(`${server}/recipes/${recipeId}`);
    return recipe.data;
  } catch (error) {
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
  }
}

//Get recipes by day for planner
export async function getMealPlan() {
  try {
    const mealPlanRecipes = await httpClient.get(`${server}/planner/recipes`);

    return mealPlanRecipes.data;
  } catch (error) {
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
  }
}

//Get collections for user
export async function getCollectionNames() {
  try {
    const collectionNames = await httpClient.get(`${server}/collections/names`);

    return collectionNames.data;
  } catch (error) {
    return Promise.reject(error.response);
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
    return Promise.reject(error.response);
  }
}

export async function deleteCollection(collection) {
  try {
    const deleteCollection = await httpClient.delete(
      `${server}/collections/delete/collection/${collection.id}`
    );
    return deleteCollection;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

export async function deleteCollectionRecipe(arrayOfRecipes) {
  try {
    const arrayOfIds = arrayOfRecipes.map((recipe) => recipe.key);

    const deleteCollectionRecipe = await httpClient.delete(
      `${server}/collections/delete/recipe`,
      { data: { ids: arrayOfIds } }
    );
    return deleteCollectionRecipe;
  } catch (error) {
    return Promise.reject(error.response);
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

    return recipe.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

export async function contact({ name, message, email }) {
  try {
    console.log(name);
    const contact = await httpClient.post(`${server}/contact`, {
      name,
      email,
      message,
    });

    return contact;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

import pako from "pako";
import { server } from "../env/env.js";
import httpClient from "./axiosConfig";

//Get category list for new recipe page
export async function getCategories() {
  try {
    const categoryList = await httpClient.get(`${server}/categories`);
    return categoryList.data[0].categories;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get category list of used categories
export async function getUsedCategories() {
  try {
    const categoryList = await httpClient.get(`${server}/categories/used/`);
    return categoryList.data[0].categories;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get category list of used categories in collection
export async function getCollectionCategories({ collectionId }) {
  try {
    const categoryList = await httpClient.get(
      `${server}/categories/${collectionId}`,
    );
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
export async function editRecipe({ recipe }) {
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

    return response.data.recipeId;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Send photo scan of recipe
export async function photoImport({ scanArray }) {
  try {
    const formData = new FormData();

    scanArray.forEach((scan) => {
      formData.append("scanArray", scan);
    });

    const response = await httpClient.post(`${server}/photoimport`, formData);

    return response;
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
      },
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
      },
    );

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
      },
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
export async function getRecipeCards({
  page,
  search,
  pageSize,
  sort,
  category,
  queryParams: { collectionId },
}) {
  try {
    const recipeCards = await httpClient.get(
      `${server}/recipecards?page=${page}&search=${search}&pageSize=${pageSize}}&sort=${sort}&collectionId=${collectionId}&category=${category}`,
    );
    return recipeCards.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get all recipes for recipe cards on home page
export async function getMyRecipeCards({ page, search, pageSize, sort }) {
  try {
    const recipeCards = await httpClient.get(
      `${server}/myrecipes?page=${page}&search=${search}&pageSize=${pageSize}}&sort=${sort}`,
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
      { date: date },
    );

    return mealPlanRecipes.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

export async function deleteFromMealPlan(planId) {
  try {
    const deletedMealPlanRecipe = await httpClient.delete(
      `${server}/planner/delete/${planId}`,
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

//Get public collections
export async function getPublicCollections() {
  try {
    const collectionRecipes = await httpClient.get(
      `${server}/publiccollections`,
    );
    return collectionRecipes.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get recipes by collection
export async function getCollectionRecipes({ collectionId }) {
  try {
    const collectionRecipes = await httpClient.get(
      `${server}/collections/${collectionId}`,
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
    const { data } = await httpClient.post(
      `${server}/collections/add/recipe/${recipeId}`,
      { collection: collection },
    );
    return data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Delete Collection
export async function deleteCollection(collection) {
  try {
    const deleteCollection = await httpClient.delete(
      `${server}/collections/delete/collection/${collection.id}`,
    );
    return deleteCollection;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Edit Collection
export async function editCollection({ collection }) {
  try {
    const { data } = await httpClient.post(`${server}/collections/edit`, {
      collection,
    });
    return data;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Delete array of recipes
export async function deleteCollectionRecipe(arrayOfRecipes) {
  try {
    const arrayOfIds = arrayOfRecipes.map((recipe) => recipe.key || recipe);

    const deleteCollectionRecipe = await httpClient.delete(
      `${server}/collections/delete/recipe`,
      { data: { ids: arrayOfIds } },
    );
    return deleteCollectionRecipe;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

//Get recipe data from url
export async function scrapeRecipe({ url, html }) {
  try {
    if (url) {
      // Send URL as JSON
      const recipe = await httpClient.post(
        `${server}/import/scrape`,
        { url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return recipe.data;
    }

    if (html) {
      // Compress HTML
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(html); // Don't JSON.stringify!
      const compressed = pako.deflate(uint8Array);

      // Send as FormData (bypasses JSON body-parser limit)
      const formData = new FormData();
      const blob = new Blob([compressed], { type: "application/octet-stream" });
      formData.append("compressedHtml", blob, "html.gz");

      const recipe = await httpClient.post(
        `${server}/import/scrape`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return recipe.data;
    }

    throw new Error("Either url or html must be provided");
  } catch (error) {
    return Promise.reject(error.response);
  }
}

export async function contact(name, email, message) {
  try {
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

export async function updateRating(recipeId, userRating) {
  try {
    const rate = await httpClient.post(`${server}/rating/update`, {
      recipeId,
      userRating,
    });

    return rate;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

export async function deleteRating(recipeId) {
  try {
    const rate = await httpClient.post(`${server}/rating/delete`, {
      recipeId,
    });

    return rate;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

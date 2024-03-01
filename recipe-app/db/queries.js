import axios from "axios";

const server = import.meta.env.VITE_SERVER_HOST;

//Get category list for new recipe page
export async function getCategories() {
  try {
    const categoryList = await axios.get(`${server}/categories`);
    return categoryList.data[0].categories;
  } catch (error) {
    console.log(error);
  }
}

//Get cuisine list for new recipe page
export async function getCuisines() {
  try {
    const cuisineList = await axios.get(`${server}/cuisines`);
    return cuisineList.data[0].cuisines;
  } catch (error) {
    console.log(error);
  }
}

//Delete recipe from recipe page
export async function deleteRecipe(recipeId) {
  try {
    const deletedRecipe = await axios.delete(
      `${server}/recipes/${recipeId}/delete`
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
    const response = await axios.post(`${server}/edit`, updatedRecipe, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(1, err);
  }
}

//Create new recipe and return recipe ID created
export async function newRecipe(updatedRecipe) {
  try {
    const response = await axios.post(`${server}/newrecipe`, updatedRecipe, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.recipe_id;
  } catch (err) {
    console.error(1, err);
  }
}

//Save price info from popup modal on recipe page
export async function savePrice(pkgGrms, pkgCost, url, fdc_id) {
  try {
    const result = await axios.post(`${server}/ingredients/price`, {
      pkgGrms: pkgGrms,
      pkgCost: pkgCost,
      url: url,
      fdc_id: fdc_id,
    });
  } catch (error) {
    console.log(error);
  }
}

//Return search results from editable ingredient list
export async function ingredientSearch(e, search) {
  e.preventDefault();
  try {
    const listIngredients = await axios.post(
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
    console.error(error);
  }
}

//Import page get directions as array
export async function parseDirections(directions) {
  try {
    const directionsArray = await axios.post(
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
    const ingredientsArray = await axios.post(
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
    const recipe = await axios.get(`${server}/recipes/${recipeId}`);
    return recipe.data;
  } catch (error) {
    console.error(error);
  }
}

//Get all recipes for recipe cards on home page
export async function getRecipeCards() {
  try {
    const recipeCards = await axios.get(`${server}/recipecards`);
    return recipeCards.data;
  } catch (error) {
    console.error(error);
  }
}

//Get all cuisines for sidebar filter list
export async function getSidebarCuisines() {
  try {
    const sidebarCuisines = await axios.get(`${server}/sidebarcuisines`);
    return sidebarCuisines.data;
  } catch (error) {
    console.error(error);
  }
}

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/** Global state of the app
 *  - Search Object
 *  - Current recipe
 *  - Shopping list Object
 *  - Liked recipes
 */

const state = {};

/**
 *  SEARCH CONTROLLER
 */

const controlSearch = async () => {
  // 1. Get the query from view
  const query = searchView.getInput();

  if(query){
    // 2. New Search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try{
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    }catch(error){
      alert('Something wrong with the search...');
      clearLoader();
    }
    
  }

}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  RECIPE CONTROLLER
 */

const controlRecipe = async () =>{
  // getting the hash value from URL
  const id = window.location.hash.replace('#', '');
  
  if(id){
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if(state.search) searchView.highlightSelected(id);

    // create new Recipe Object
    state.recipe = new Recipe(id);

    try{
      // Get recipe data and parse the ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    }catch(error){
      alert('Error proccessing recipe!');
    }
    
  }
};

// window.addEventListener('hashchange',  controlRecipe);
// window.addEventListener('load', controlRecipe);

// Adding same eventListener to multiple events

['hashchange', 'load'].forEach( event => window.addEventListener(event, controlRecipe));
//Importing model
import * as model from './models.js';

//Importing views

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


import {MODAL_CLOSE_SEC} from './config.js';
//Importing libraries
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if(module.hot){
  module.hot.accept();
}

  const controlRecipes = async (id='') => {    
    try{
      //get recipe id from url
      const id = window.location.hash.slice(1);
      if(!id) return;

      //show spinner
      recipeView.renderSpinner();

       //Add active class to the current search result
      if(model.state.search.query !== '')resultsView.update(model.getSearchResultsPage());
      await model.loadRecipe(id);      

      //show recipe
      recipeView.render(model.state.recipe);
      bookmarksView.render(model.state.bookmarks);
    } catch (err){
      console.error(err);
      recipeView.renderError();
    }
  };

const controlSearchResults = async function(){
  try {
    model.state.search.page = 1;
    // show spinner
    resultsView.renderSpinner();

    // get information
    const query = searchView.getQuery();
    if(!query) return;
    await model.loadSearchResults(query);

    // display search results
    resultsView.render(model.getSearchResultsPage());

    //show initial pagination buttons
    paginationView.render(model.state.search);
    bookmarksView.render(model.state.bookmarks);
  } catch(err){
    console.error(err);
  }
};
const controlPagination = function(page){
  // display new search results
    resultsView.render(model.getSearchResultsPage(page));

    //show new pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function(newServings){
  model.updateServings(newServings);
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function(){  
  if(!model.state.recipe.bookmarked) {
    model.addBookmarks(model.state.recipe);   
  }
  else {
    model.removeBookmarks(model.state.recipe.id);    
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  
};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // fetch new recipe information
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe to the view
    recipeView.render(model.state.recipe);

    //show success message
    addRecipeView.renderMessage();

    // Add this to the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);


    // Close upload modal after timeout
    setTimeout(()=>{
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err){
    console.error(err);
    addRecipeView.renderError(err);
  } 
};

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmarks(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
import { async } from 'regenerator-runtime';
import {API_URL,API_KEY,RES_PER_PAGE} from './config.js';
import {AJAX} from './helpers.js';
export const state = {
	recipe:{},
  search: {
    query:'',
    results: {},
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []
};

const createRecipeObject = function(data){
  const { recipe } = data.data;    
  return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key: recipe.key})
    };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    if(state.bookmarks.some(bookmark => bookmark.id === id)){
      state.recipe.bookmarked = true;
    } else{
      state.recipe.bookmarked = false;
    }
    } catch (err) {
      throw err;
    }	
  };

  export const loadSearchResults = async function(query){
    try{
      state.search.query = query;
      const url = `${API_URL}?search=${query}&key=${API_KEY}`;      
      const data = await AJAX(url);
      state.search.results = data.data.recipes.map(recipe => {
        return {
          id: recipe.id,
          title: recipe.title,
          publisher: recipe.publisher,        
          image: recipe.image_url,
          ...(recipe.key && {key: recipe.key})
        }
      });
    } catch(err){
      throw err;
    }
  };

  export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    const start = (page -1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);       
  };

  export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ing => {
      ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = newServings;
  };
const persistBookmarks = function(){
  localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
};
  export const addBookmarks = function(recipe){
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
  };

  export const removeBookmarks = function(id){
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index,1);

    //Mark current recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
  };

  const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
  };
  init();

  // for dev purposes

  const clearBookmarks = function(){
    localStorage.clear('bookmarks');
  };

  //clearBookmarks();

  export const uploadRecipe = async function(newRecipe){
    try{
      const input = Object.entries(newRecipe);
      const ingredients = input.filter(item => item[0].startsWith('ingredient') && item[1] !== '')
      .map(ing => {
        //const ingArr = ing[1].replaceAll(' ','').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if(ingArr.length !== 3) throw new Error('Wrong ingredients format, please enter them in the right format to continue :)');
        const [quantity,unit,description] = ingArr;
        return {quantity: quantity ? +quantity : null,unit,description};
      });    
      const recipe = {
        title: newRecipe.title,
        publisher: newRecipe.publisher,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        servings: +newRecipe.servings,
        cooking_time: +newRecipe.cookingTime,
        ingredients,
      }; 
    //console.log(recipe); 
    let url = `${API_URL}?key=${API_KEY}`;
    const data = await AJAX(url,recipe);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);
    } catch(err){
      throw err;
    }
    
  };

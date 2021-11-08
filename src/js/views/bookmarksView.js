import View from './View.js';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View{
	_parentElement = document.querySelector('.bookmarks__list');
	_errorMessage = `No bookmarks yet. Find a nice recipe to bookmark it`;
	_message = '';
  addHandlerRender(handler){
    window.addEventListener('load',handler);
  };
  _generateMarkup(){
		return this._data.map(bookmark => PreviewView.render(bookmark,false)).join('');		
	}
}

export default new BookmarksView();

/*
     .preview__link--active
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                */
import View from './View.js';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View{
	_parentElement = document.querySelector('.results');
	_errorMessage = `No recipes found for your query :(`;
  _message = 'Nae nibba nibba nibba nae nae';
	_generateMarkup(){
		return this._data.map(result => PreviewView.render(result,false)).join('');	
	}
/*
	_generatePreviewMarkup(result){
    const currentId = window.location.hash.slice(1);
    //console.log(result.id, currentId);
		return `
			<li class="preview">
            <a class="preview__link ${result.id === currentId ? 'preview__link--active':''}"  href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
              <div class="preview__user-generated ${result.key ? '' : 'hidden'}">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
            </a>
          </li>
		`;
	}*/
}

export default new ResultsView();

/*
     .preview__link--active
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                */
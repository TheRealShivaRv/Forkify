class SearchView {
	#parentEl = document.querySelector('.search');
	#searchField = this.#parentEl.querySelector('.search__field');
	getQuery(){
		const query = this.#searchField.value;
		this.#clearInput();
		return query;
	}
	#clearInput(){
		return this.#searchField.value = '';
	}
	addHandlerSearch(handler){
		this.#parentEl.addEventListener('submit',(e) => {
			e.preventDefault();
			handler();
		});
	}
}

export default new SearchView();
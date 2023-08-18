import rootDir from "./rootDir.js";

class SearchForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initEventListener();
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/SearchForm.css" />
      <form class="search-form">
        <div class="search-form__inner">
          <input
            type="text"
            id="title"
            placeholder="영화를 검색해보세요."
            class="search-form__input"
          />
          <button type="submit" class="search-form__button">
            <img src="${rootDir}/images/search-icon.svg" alt="검색" />
          </button>
        </div>
      </form>
    `;
  }

  initEventListener() {
    this.shadowRoot.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();

      const title = e.target.title.value;

      location.assign(`${rootDir}/pages/search/search.html?title=${title}`);
    });
  }
}

export default SearchForm;

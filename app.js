import GlobalHeader from "./scripts/GlobalHeader.js";
import SearchForm from "./scripts/SearchForm.js";
import MovieList from "./scripts/MovieList.js";
import MovieItem from "./scripts/MovieItem.js";
import MovieDetail from "./scripts/MovieDetail.js";
import GlobalFooter from "./scripts/GlobalFooter.js";

class App {
  init() {
    customElements.define("global-header", GlobalHeader);
    customElements.define("search-form", SearchForm);
    customElements.define("movie-list", MovieList);
    customElements.define("movie-item", MovieItem);
    customElements.define("movie-detail", MovieDetail);
    customElements.define("global-footer", GlobalFooter);
  }
}

const app = new App();
app.init();

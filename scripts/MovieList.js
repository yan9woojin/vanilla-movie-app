import API from "./API.js";
import Storage from "./Storage.js";
import rootDir from "./rootDir.js";

class MovieList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/MovieList.css" />
      <ol class="movies">
      </ol>
    `;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    switch (this.dataset.link) {
      case "box-office":
        this.renderBoxOffice();
        break;
      case "upcoming-movies":
        this.renderUpcomingMovies();
        break;
      case "archive":
        this.renderArchive();
        break;
      case "search":
        this.renderSearch();
        break;
    }
  }

  async renderBoxOffice() {
    const itemNum = this.dataset.item;
    const boxOffice = await API.getBoxOffice();
    this.renderSkeleton(itemNum);

    for (const movie of boxOffice.slice(0, itemNum)) {
      const { rank, title, releaseDate } = movie;
      const poster = await API.getMoviePoster(title, releaseDate);
      this.createMovieItem(title, poster, releaseDate, rank);
    }
  }

  async renderUpcomingMovies() {
    const itemNum = this.dataset.item ?? "100";
    const upcomingMovies = await API.getUpcomingMovies();
    this.renderSkeleton(5);

    for (const movie of upcomingMovies.slice(0, itemNum)) {
      const { title, poster, releaseDate } = movie;
      this.createMovieItem(title, poster, releaseDate);
    }
  }

  renderArchive() {
    const archive = Storage.getItem("archive") ?? [];

    if (archive.length === 0) {
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/MovieList.css" />
      <div class="empty">
      <p class="empty__text">보관함이 비어 있습니다.</p>
      <a href="./box-office.html" class="empty__link">영화 담기</a>
      </div>
      `;
      return;
    }

    this.renderSkeleton(archive.length);

    for (const movie of archive) {
      const { title, poster, releaseDate } = movie;
      this.createMovieItem(title, poster, releaseDate);
    }
  }

  async renderSearch() {
    const params = new URL(location).searchParams;
    const title = params.get("title");
    const result = await API.searchMovie(title);

    for (const movie of result) {
      const { title, poster, releaseDate } = movie;
      this.createMovieItem(title, poster, releaseDate);
    }
  }

  renderSkeleton(itemNum) {
    for (let i = 0; i < itemNum; i++) {
      const el = document.createElement("li");
      el.classList.add("loading");
      this.shadowRoot.querySelector(".movies").append(el);
    }
  }

  createMovieItem(title, poster, releaseDate, rank = null) {
    const movieItem = document.createElement("movie-item");

    movieItem.setAttribute("data-title", title);
    movieItem.setAttribute("data-poster", poster);
    movieItem.setAttribute("data-release-date", releaseDate);

    if (rank) {
      movieItem.setAttribute("data-rank", rank);
    }

    if (Storage.findMovieFromArchive(title)) {
      movieItem.setAttribute("data-like", "");
    }

    const loading = this.shadowRoot.querySelector(".loading");
    if (loading) {
      loading.replaceWith(movieItem);
    } else {
      this.shadowRoot.querySelector(".movies").append(movieItem);
    }
  }
}

export default MovieList;

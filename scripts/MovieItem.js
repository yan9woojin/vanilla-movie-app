import FormattedDate from "./FormattedDate.js";
import Storage from "./Storage.js";
import rootDir from "./rootDir.js";

class MovieItem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.initEventListener();
  }

  static get observedAttributes() {
    return ["data-like"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const imgSrc =
      newValue === ""
        ? `${rootDir}/images/filled-heart-icon.svg`
        : `${rootDir}/images/empty-heart-icon.svg`;

    const likeBtn = this.shadowRoot?.querySelector(".like-btn");
    if (likeBtn) {
      likeBtn.src = imgSrc;
    }
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/MovieItem.css" />
      <a
        href="${rootDir}/pages/movies/movie-detail.html?title=${this.dataset.title}&releaseDate=${
      this.dataset.releaseDate
    }"
        class="link"
      >
        ${this.dataset.rank ? `<span class="badge">${this.dataset.rank}</span>` : ""}
        <div class="poster">
          <img src="${this.dataset.poster}" alt="${this.dataset.title}" class="poster__image" />
        </div>
        <h3 class="title">${this.dataset.title}</h3>
      </a>
      <div class="info">
        <span class="release-date">${FormattedDate.getDate(this.dataset.releaseDate)}</span>
        <img
          src="${
            this.dataset.like === ""
              ? `${rootDir}/images/filled-heart-icon.svg`
              : `${rootDir}/images/empty-heart-icon.svg`
          }"
          alt="heart"
          class="btn like-btn"
        />
      </div>
    `;
  }

  initEventListener() {
    this.shadowRoot
      .querySelector(".like-btn")
      .addEventListener("click", this.handleLikeBtnClick.bind(this));
  }

  handleLikeBtnClick() {
    if (this.dataset.like === "") {
      this.removeFromArchive();
    } else {
      this.addToArchive();
    }
  }

  addToArchive() {
    const { title, poster, releaseDate } = this.dataset;
    const movie = { title, poster, releaseDate };
    Storage.addMovieToArchive(movie);
    this.setAttribute("data-like", "");
  }

  removeFromArchive() {
    const movieTitle = this.dataset.title;
    Storage.removeMovieFromArchive(movieTitle);
    this.removeAttribute("data-like");
  }
}

export default MovieItem;

import API from "./API.js";
import FormattedDate from "./FormattedDate.js";
import Storage from "./Storage.js";
import rootDir from "./rootDir.js";

class MovieDetail extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    await this.render();
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

  async render() {
    this.attachShadow({ mode: "open" });

    const params = new URL(location).searchParams;
    const title = params.get("title");
    const release = params.get("releaseDate");
    const poster = await API.getMoviePoster(title, release);
    const { genre, rating, releaseDate, actors, director, plot } = await API.getMovieDetail(
      title,
      release
    );

    this.dataset.title = title;
    this.dataset.poster = poster;
    this.dataset.releaseDate = releaseDate;

    if (Storage.findMovieFromArchive(title)) {
      this.setAttribute("data-like", "");
    }

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/MovieDetail.css" />
      <div class="movie">
        <img src="${poster}" alt="${title}" class="movie__poster" />
        <div class="movie__info">
          <h3 class="movie__title">${title}</h3>
          <p class="movie__director">감독 : ${director}</p>
          <p class="movie__actors">출연 : ${actors}</p>
          <p class="movie__genre">장르 : ${genre}</p>
          ${rating ? `<p class="movie__rating">등급 : ${rating}</p>` : ""}
          <p class="movie__releaseDate">개봉일 : ${FormattedDate.getDate(releaseDate)}</p>
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
        ${plot ? `<p class="movie__plot">${plot}</p>` : ""}
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

export default MovieDetail;

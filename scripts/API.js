import FormattedDate from "./FormattedDate.js";
import Storage from "./Storage.js";

class API {
  static KOFIC_BASE_URL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest";
  static KOFIC_API_KEY = "";

  static KMDB_BASE_URL =
    "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2";
  static KMDB_API_KEY = "";

  static async getBoxOffice() {
    if (Storage.hasBoxOffice()) {
      return Storage.getItem("boxOffice");
    }

    const yesterdayDate = FormattedDate.getYesterdayDate();

    const url = `${this.KOFIC_BASE_URL}/boxoffice/searchDailyBoxOfficeList.json?key=${this.KOFIC_API_KEY}&targetDt=${yesterdayDate}`;
    const response = await fetch(url);
    const { boxOfficeResult } = await response.json();
    const { dailyBoxOfficeList } = boxOfficeResult;

    const boxOffice = [];

    for (const movieData of dailyBoxOfficeList) {
      const { rank, movieNm, openDt } = movieData;

      const movie = {
        rank,
        title: movieNm,
        releaseDate: openDt.replaceAll("-", ""),
      };

      boxOffice.push(movie);
    }

    Storage.setItem("boxOffice", boxOffice);
    Storage.setItem("boxOfficeRefDate", yesterdayDate);

    return boxOffice;
  }

  static async getUpcomingMovies() {
    if (Storage.hasUpcomingMovies()) {
      return Storage.getItem("upcomingMovies");
    }

    const tomorrowDate = FormattedDate.getTomorrowDate();

    const url = `${this.KMDB_BASE_URL}&ServiceKey=${this.KMDB_API_KEY}&releaseDts=${tomorrowDate}&listCount=100`;
    const response = await fetch(url);
    const { Data } = await response.json();
    const movies = Data[0].Result;

    const upcomingMovies = [];

    for (const movieData of movies) {
      const { title, posters, repRlsDate } = movieData;
      const poster = posters.split("|")[0];

      if (poster && repRlsDate.length === 8 && repRlsDate.slice(-2) !== "00") {
        const movie = {
          poster,
          title: title.trim(),
          releaseDate: repRlsDate,
        };

        upcomingMovies.push(movie);
      }
    }

    upcomingMovies.sort((a, b) => a.releaseDate - b.releaseDate);

    Storage.setItem("upcomingMovies", upcomingMovies);
    Storage.setItem("upcomingMoviesRefDate", tomorrowDate);

    return upcomingMovies;
  }

  static async getMoviePoster(movieTitle, releaseDate) {
    let poster = Storage.getMoviePoster(movieTitle);

    if (poster) {
      return poster;
    }

    const url = `${this.KMDB_BASE_URL}&ServiceKey=${this.KMDB_API_KEY}&title=${movieTitle}&releaseDts=${releaseDate}`;
    const response = await fetch(url);
    const { Data } = await response.json();
    const { posters } = Data[0].Result[0];

    poster = posters.split("|")[0];

    const cachedPosters = Storage.getItem("posters") ?? {};
    Storage.setItem("posters", { ...cachedPosters, [movieTitle]: poster });

    return poster;
  }

  static async getMovieDetail(movieTitle, releaseDate) {
    const url = `${this.KMDB_BASE_URL}&ServiceKey=${this.KMDB_API_KEY}&title=${movieTitle}&releaseDts=${releaseDate}&detail=Y`;
    const response = await fetch(url);
    const { Data } = await response.json();
    const movie = Data[0].Result[0];
    const { actors, directors, genre, rating, repRlsDate, plots } = movie;

    const { actor } = actors;
    const { director } = directors;
    const { plot } = plots;

    const actorNames = [];

    for (const act of actor.slice(0, 10)) {
      actorNames.push(act.actorNm);
    }

    const movieDetail = {
      rating,
      genre: genre.replaceAll(",", ", "),
      releaseDate: repRlsDate,
      actors: actorNames.join(", "),
      director: director[0].directorNm,
      plot: plot[0].plotText
        .replaceAll("...", "…")
        .replaceAll("!", "!\n\n")
        .replace(/\.(\s*)(?!["”])/g, ".\n\n"),
    };

    return movieDetail;
  }

  static async searchMovie(movieTitle) {
    const url = `${this.KMDB_BASE_URL}&ServiceKey=${this.KMDB_API_KEY}&title=${movieTitle}&listCount=100`;
    const response = await fetch(url);
    const { Data } = await response.json();
    const movies = Data[0].Result ?? [];

    const result = [];

    for (const movieData of movies) {
      const { title, posters, repRlsDate } = movieData;
      const poster = posters.split("|")[0];

      if (poster && repRlsDate.length === 8 && repRlsDate.slice(-2) !== "00") {
        const movie = {
          poster,
          releaseDate: repRlsDate,
          title: title.replace(/\s*(!HE|!HS)\s*/g, "").trim(),
        };

        result.push(movie);
      }
    }

    return result;
  }
}

export default API;

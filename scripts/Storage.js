import FormattedDate from "./FormattedDate.js";

class Storage {
  static getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static hasBoxOffice() {
    return (
      this.getItem("boxOfficeRefDate") === FormattedDate.getYesterdayDate() &&
      this.getItem("boxOffice").length > 0
    );
  }

  static hasUpcomingMovies() {
    return (
      this.getItem("upcomingMoviesRefDate") === FormattedDate.getTomorrowDate() &&
      this.getItem("upcomingMovies").length > 0
    );
  }

  static getMoviePoster(movieTitle) {
    const posters = this.getItem("posters");

    for (const title in posters) {
      if (title === movieTitle) {
        return posters[title];
      }
    }

    return null;
  }

  static addMovieToArchive(movie) {
    const archive = this.getItem("archive") ?? [];

    archive.push(movie);

    this.setItem("archive", archive);
  }

  static findMovieFromArchive(movieTitle) {
    const archive = this.getItem("archive");

    return archive?.find((movie) => movie.title === movieTitle) ?? null;
  }

  static removeMovieFromArchive(movieTitle) {
    const archive = this.getItem("archive");

    const updatedArchive = archive.filter((movie) => movie.title !== movieTitle);

    this.setItem("archive", updatedArchive);
  }
}

export default Storage;

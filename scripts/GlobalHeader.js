import rootDir from "./rootDir.js";

class GlobalHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/GlobalHeader.css" />
      <div class="inner">
        <h1 class="logo">
          <a href="${rootDir}/index.html" class="logo__link">Movies</a>
        </h1>
        <nav class="gnb">
          <ul class="menu gnb__movies">
            <li class="menu__item">
              <a href="${rootDir}/pages/movies/box-office.html" class="menu__link">영화</a>
              <div class="submenu">
                <ul class="submenu__list">
                  <li class="submenu__item">
                    <a href="${rootDir}/pages/movies/box-office.html" class="submenu__link">박스오피스</a>
                  </li>
                  <li class="submenu__item">
                    <a href="${rootDir}/pages/movies/upcoming-movies.html" class="submenu__link">
                      개봉예정
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="menu__item">
              <a href="${rootDir}/pages/movies/archive.html" class="menu__link">보관함</a>
            </li>
          </ul>
          <search-form></search-form>
          <ul class="menu gnb__users">
            <li class="menu__item">
              <a href="${rootDir}/pages/users/signin.html" class="menu__link">로그인</a>
            </li>
            <li class="menu__item">
              <a href="${rootDir}/pages/users/signup.html" class="menu__link">회원가입</a>
            </li>
          </ul>
        </nav>
      </div>
    `;
  }
}

export default GlobalHeader;

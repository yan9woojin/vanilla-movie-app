import rootDir from "./rootDir.js";

class GlobalFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="${rootDir}/styles/css/GlobalFooter.css" />
      <div class="inner">
        <div class="logo">
          <a href="${rootDir}/index.html" class="logo__title">Movies</a>
        </div>
        <div class="copyright">
          ${"&copy"} ${new Date().getFullYear()} 양우진. All Rights Reserved.
        </div>
        <div class="contact">
          <div class="contact__item">
            <a href="https://github.com/yan9woojin" target="_blank" class="contact__link">
              <img src="${rootDir}/images/github-icon.svg" alt="github" class="contact__image" />
              <span class="contact__title">Github</span>
            </a>
          </div>
          <div class="contact__item">
            <a class="contact__link">
              <img src="${rootDir}/images/email-icon.svg" alt="github" class="contact__image" />
              <span class="contact__title">yan9woojin@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

export default GlobalFooter;

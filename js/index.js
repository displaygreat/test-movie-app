import createMoviesList, {
  handleOnMenuLinkClick,
  getMovies,
} from "./moviesList.js";
import {
  api_url_popular,
  api_url_playing,
  currentPage,
  prevPage,
  nextPage,
  totalPages,
  setCurrentPage,
  isPopular,
  isPlaying,
} from "./utils.js";

import { menuLink, menuBtn, prev, next, navbar } from "./utils.js";

createMoviesList();

document.addEventListener("click", async (e) => {
  const { createMovieDetails } = await import("./moviePage.js");
  createMovieDetails(e);
});
document.addEventListener("click", async (e) => {
  const { setFavorite } = await import("./moviePage.js");
  setFavorite(e);
});

menuLink.forEach((link) => {
  link.addEventListener("click", handleOnMenuLinkClick);
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    main.innerHTML = "";
    setCurrentPage(currentPage - 1);
    if (isPopular) {
      getMovies(api_url_popular);
    }
    if (isPlaying) {
      getMovies(api_url_playing);
    }
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    main.innerHTML = "";
    setCurrentPage(currentPage + 1);
    if (isPopular) {
      getMovies(api_url_popular);
    }
    if (isPlaying) {
      getMovies(api_url_playing);
    }
  }
});

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("menu-button-active");
  navbar.classList.toggle("navbar-active");
});

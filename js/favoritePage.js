import { createMovieCard } from "./moviesList.js";
import { favorites, pagination } from "./utils.js";

export const createFavoriteMoviesPage = () => {
  main.innerHTML = "";
  main.insertAdjacentHTML("afterbegin", `<h2 class="page-title">Favorite</h2>`);

  favorites.forEach((movie) => {
    createMovieCard(movie);
  });

  pagination.classList.add("hide");
};

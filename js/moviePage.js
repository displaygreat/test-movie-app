import { api_key } from "./utils.js";
import {
  pagination,
  favorites,
  setFavorites,
  hasMark,
  setHasMark,
} from "./utils.js";

export const createMovieDetails = (e) => {
  if (e.target.closest(".card")) {
    const movieId = e.target.closest(".card").getAttribute("data-movieId");
    getSelectedMovie(movieId);
  }
};

const getSelectedMovie = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("Server Error");
    }
    const data = await response.json();
    createMoviePage(data);
  } catch (err) {
    console.log(err);
  }
};

const hasFavoriteMark = (id) => {
  favorites.forEach((movie) => {
    if (id === movie.imdb_id) {
      setHasMark(true);
    }
  });
};

const createMoviePage = (movie) => {
  hasFavoriteMark(movie.imdb_id);
  main.textContent = "";

  let imgLink = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "img/no-image-movie.png";

  const moviePage = `
      <div class="movie" data-movieId="${movie.imdb_id}">
        <div class="movie-img">
        <img src="${imgLink}" alt="poster" class="card-img">
        </div>
        <div class="movie-content">
          <h2 class="movie-title">${
            movie.original_title
          } <span>(${movie.release_date.slice(0, 4)})</span></h2>
          <p class="text">${movie.genres[0].name} &middot; ${movie.runtime}m</p>
          <button class="favorite-btn ${hasMark ? "active" : ""}">
            <svg width='24px' height='24px' viewBox='0 0 16 16' class='favorite-icon' xmlns='http://www.w3.org/2000/svg'>
              <path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/>
            </svg>
          </button>
          <h3 class="movie-subtitle">Overview</h3>
          <p class="text">${movie.overview}</p>
        </div>
      </div>
    `;
  main.insertAdjacentHTML("beforeend", moviePage);
  pagination.classList.add("hide");
};

const addFavoriteMovie = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("Server Error");
    }
    const data = await response.json();
    const newFavorites = [...favorites, data];
    setFavorites(newFavorites);
    localStorage.setItem("favorite", JSON.stringify(newFavorites));
  } catch (err) {
    console.log(err);
  }
};

const removeFavoriteMovie = (id) => {
  const newFavorites = favorites.filter((favorite) => favorite.imdb_id !== id);
  setFavorites(newFavorites);
  localStorage.setItem("favorite", JSON.stringify(newFavorites));
};

export const setFavorite = (e) => {
  if (e.target.closest(".favorite-btn")) {
    const favoriteBtn = e.target.closest(".favorite-btn");
    favoriteBtn.classList.toggle("active");
    const movieId = e.target.closest(".movie").getAttribute("data-movieId");

    if (favoriteBtn.classList.contains("active")) {
      addFavoriteMovie(movieId);
    } else {
      removeFavoriteMovie(movieId);
    }
  }
};

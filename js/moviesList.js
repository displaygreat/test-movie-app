import { api_url_popular, api_url_playing } from "./utils.js";
import {
  main,
  navbar,
  menuBtn,
  prev,
  next,
  current,
  pagination,
} from "./utils.js";
import {
  currentPage,
  totalPages,
  setCurrentPage,
  setPrevPage,
  setNextPage,
  setTotalPage,
  isPopular,
  setIsPopular,
  isPlaying,
  setIsPlaying,
  setHasMark,
} from "./utils.js";
import { createFavoriteMoviesPage } from "./favoritePage.js";

export const handleOnMenuLinkClick = (e) => {
  let link = e.target.getAttribute("href").slice(1);
  if (window.matchMedia("(max-width: 768px)").matches) {
    menuBtn.classList.toggle("menu-button-active");
    navbar.classList.toggle("navbar-active");
  }
  if (link === "favorite") {
    createFavoriteMoviesPage();
  }
  if (link === "playing") {
    setIsPlaying(true);
    setIsPopular(false);
    setCurrentPage(1);
    getMovies(api_url_playing);
  }
  if (link === "popular") {
    setIsPlaying(false);
    setIsPopular(true);
    setCurrentPage(1);
    getMovies(api_url_popular);
  }
  setHasMark(false);
};

export const getMovies = async (url) => {
  main.innerHTML = "";
  let loader = `<div class="loader"></div>`;
  main.innerHTML = loader;
  pagination.classList.add("hide");

  try {
    const response = await fetch(url + currentPage);
    if (!response.ok) {
      throw new Error("Server Error");
    }

    const data = await response.json();

    if (data.results.length !== 0) {
      main.innerHTML = "";
      main.insertAdjacentHTML(
        "afterbegin",
        isPopular
          ? `<h2 class="page-title">Popular</h2>`
          : isPlaying
          ? `<h2 class="page-title">Now Playing</h2>`
          : ""
      );
      data.results.forEach((movie) => {
        createMovieCard(movie);
      });

      pagination.classList.remove("hide");

      setCurrentPage(data.page);
      setPrevPage(currentPage - 1);
      setNextPage(currentPage + 1);
      setTotalPage(data.total_pages);

      current.innerText = currentPage;

      if (currentPage <= 1) {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
      } else if (currentPage >= totalPages) {
        prev.classList.remove("disabled");
        next.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
        next.classList.remove("disabled");
      }
    } else {
      main.innerHTML = `<p class="no-results">No Results Found</p>`;
    }
  } catch (err) {
    console.log(err);
  }
};

export const createMovieCard = (movie) => {
  let date = new Date(Date.parse(movie.release_date)).toDateString().slice(4);
  let imgLink = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "img/no-image-card.png";
  const movieCard = `
      <div class="card" data-movieId="${movie.id}">
        <div class="card-img">
          <img src="${imgLink}" alt="poster" class="card-img">
        </div>
        <div class="card-content">
          <h3 class="card-title">${movie.original_title}</h3>
          <span class="card-text">${date}</span>
        </div>
      </div>
    `;
  main.insertAdjacentHTML("beforeend", movieCard);
};

const createMoviesList = () => {
  setIsPopular(true);
  getMovies(api_url_popular);
};

export default createMoviesList;

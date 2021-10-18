"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const api_key = "2c46288716a18fb7aadcc2a801f3fc6b";
  const api_url_popular = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=`;
  const api_url_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=`;

  const main = document.getElementById("main");
  const menuLink = document.querySelectorAll(".menu-link");
  const pagination = document.querySelector(".pagination");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const current = document.getElementById("current");
  const menuBtn = document.querySelector(".menu-button");
  const navbar = document.querySelector(".navbar");

  let favorites = JSON.parse(localStorage.getItem("favorite")) || [];
  let hasMark = false;

  let isPopular = false;
  let isPlaying = false;

  let currentPage = 1;
  let nextPage;
  let prevPage;
  let totalPages = 100;

  const getMovies = async (url) => {
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

        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

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

  const createMovieCard = (movie) => {
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

  const handleMovieId = (e) => {
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
        hasMark = true;
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
      favorites = newFavorites;
      localStorage.setItem("favorite", JSON.stringify(newFavorites));
    } catch (err) {
      console.log(err);
    }
  };

  const removeFavoriteMovie = (id) => {
    const newFavorites = favorites.filter(
      (favorite) => favorite.imdb_id !== id
    );
    favorites = newFavorites;
    localStorage.setItem("favorite", JSON.stringify(newFavorites));
  };

  const setFavorite = (e) => {
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

  const createFavoriteMoviesPage = () => {
    main.innerHTML = "";
    main.insertAdjacentHTML(
      "afterbegin",
      `<h2 class="page-title">Favorite</h2>`
    );

    favorites.forEach((movie) => {
      createMovieCard(movie);
    });

    pagination.classList.add("hide");
  };

  const handleOnMenuLinkClick = (e) => {
    let link = e.target.getAttribute("href").slice(1);
    if (window.matchMedia("(max-width: 768px)").matches) {
      menuBtn.classList.toggle("menu-button-active");
      navbar.classList.toggle("navbar-active");
    }
    if (link === "favorite") {
      createFavoriteMoviesPage();
    }
    if (link === "playing") {
      isPopular = false;
      isPlaying = true;
      currentPage = 1;
      getMovies(api_url_playing);
    }
    if (link === "popular") {
      isPopular = true;
      isPlaying = false;
      currentPage = 1;
      getMovies(api_url_popular);
    }
  };

  document.addEventListener("click", handleMovieId);
  document.addEventListener("click", setFavorite);

  menuLink.forEach((link) => {
    link.addEventListener("click", handleOnMenuLinkClick);
  });

  prev.addEventListener("click", () => {
    if (prevPage > 0) {
      main.innerHTML = "";
      currentPage = currentPage - 1;
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
      currentPage = currentPage + 1;
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

  const init = () => {
    isPopular = true;
    getMovies(api_url_popular);
  };

  init();
});

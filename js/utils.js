export const api_key = "2c46288716a18fb7aadcc2a801f3fc6b";
export const api_url_popular = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=`;
export const api_url_playing = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=en-US&page=`;

export const main = document.getElementById("main");
export const navbar = document.querySelector(".navbar");
export const menuLink = document.querySelectorAll(".menu-link");
export const menuBtn = document.querySelector(".menu-button");
export const prev = document.getElementById("prev");
export const next = document.getElementById("next");
export const current = document.getElementById("current");
export const pagination = document.querySelector(".pagination");

export let favorites = JSON.parse(localStorage.getItem("favorite")) || [];

export let currentPage = 1;
export let nextPage;
export let prevPage;
export let totalPages = 100;

export let isPopular = false;
export let isPlaying = false;

export let hasMark = false;

export function setCurrentPage(page) {
  currentPage = page;
}
export function setNextPage(page) {
  nextPage = page;
}
export function setPrevPage(page) {
  prevPage = page;
}
export function setTotalPage(page) {
  totalPages = page;
}
export function setFavorites(favorite) {
  favorites = favorite;
}
export function setIsPopular(pop) {
  isPopular = pop;
}
export function setIsPlaying(play) {
  isPlaying = play;
}
export function setHasMark(mark) {
  hasMark = mark;
}

'use strict';

const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'
function main() {
  const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
  
    // Initialize page count
  let currentPage = 1;
  // Initialize scroll anchor
  function anchorPosition() {
    return $('#bottom-anchor').position().top;
  }
  // Function for getting most popular in TMDb
  function getResults(page) {
    return axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`);
  }
  // Function for creating movie card with movie details
  function createMovieCard(movie) {
    function backdropPath(path) {
      if (path === null) {
        return "https://placehold.it/780x439?text=No+Image+Found"
      }
      return `https://image.tmdb.org/t/p/w780/${path}`
    }
    return `
      
<div class="movie">
  <img src="${backdropPath(movie.backdrop_path)}" alt="${movie.title} backdrop">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average}</span>
      <div class="overview">
        <h3>Overview</h3>
        ${movie.overview}
      </div>
    </div>
  </div>
    `;
  }
  //rating
  function getClassByRate(vote) {
    if (vote >= 8) {
      return 'green'
    } else if (vote >= 5) {
      return 'orange'
    } else {
      return 'red'
    }
  }
  /*
  //search
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if (searchTerm && searchTerm !== '') {
      getResults(SEARCH_API + searchTerm)
      search.value = ''
    } else {
      window.location.reload()
    }
  })
*/

  // Function for appending cards onto page
  function appendResults() {
    getResults(currentPage).then((response) => {
      response.data.results.forEach((movie) => {
        $('#movies').append(createMovieCard(movie))
      })
    }).catch((error) => {
      console.log(error.response);
    });
    currentPage++;
  }
  // Get first page of results immediately
  appendResults();
  $(document).on('scroll', () => {
    if ($(this).scrollTop() > anchorPosition() - ($(window).height() + 500)) {
      const $anchor = $('#bottom-anchor');
      $anchor.remove();
      appendResults();
      $('#content').append($anchor);
    }
  });
}
document.addEventListener('DOMContentLoaded', main);
// form fetched from the index
let elForm = document.querySelector(".js-form");
let elInputTitel = elForm.querySelector(".js-input-titel");
let elInputPage = elForm.querySelector(".js-input-page");
let elSelect = elForm.querySelector(".js-select");

// A list to which the answer should be given
let elResult = document.querySelector(".js-result");

// Template
const elTemplate = document.querySelector("#news__template").content;
const elSecondTemplate = document.querySelector("#second__template").content;

// spinner
let elSpinner = document.querySelector(".js-content-spinner");

// error
let elError = document.querySelector(".js-error");

// modal
let elModalMovie = document.querySelector(".js-modal-movie");

// For second template video
let normalized = [];

// To index the movie
const renderMovie = data => {
  elResult.innerHTML = "";

  const elFragment = document.createDocumentFragment();
  // console.log(data.Search);

  elResult.addEventListener("click", (evt) => {
    if (evt.target.matches(".js-movie-info-button")) {
      let movieId = evt.target.closest(".news__item").dataset.imdbID;
  
      // for modal
      let foundMovie = data.Search.find(movie => {
        return movie.imdbID === movieId;
      })
  
      elModalMovie.querySelector(".js-modal-movie-title").textContent = foundMovie.Title;
      elModalMovie.querySelector(".js-modal-movie-summary").textContent = `type: ${foundMovie.Type}`;
      elModalMovie.querySelector(".js-modal-movie-year").textContent = `Year: ${foundMovie.Year}`;
    }
  })
  data.Search.forEach(data => {
    
    const copyFragment = elTemplate.cloneNode(true);

    copyFragment.querySelector(".news__img-poster").src = data.Poster;
    copyFragment.querySelector(".news__img-poster").alt = data.Title;

    copyFragment.querySelector(".news__card-title").textContent = data.Title;

    copyFragment.querySelector(".new__link").href = `http://www.imdb.com/title/${data.imdbID}/`;
    copyFragment.querySelector(".news__item").dataset.imdbID = data.imdbID ;

    elFragment.append(copyFragment);
  })
  elResult.appendChild(elFragment);
};

// to index the series
const renderMovieSecond = data => {
  elResult.innerHTML = "";

  const elFragment = document.createDocumentFragment();

  data.Episodes.forEach(data => {
    normalized.push({
      video: `http://www.imdb.com/title/${data.imdbID}/`
    })
    
    const copyFragment = elSecondTemplate.cloneNode(true);

    normalized.forEach(data => {
      copyFragment.querySelector(".second__img-poster").href = data.video;
    })

    copyFragment.querySelector(".second__card-title").textContent = data.Title;
    copyFragment.querySelector(".second__card-title-second").textContent = data.Released;
    copyFragment.querySelector(".second__card-title-third").textContent = data.Episode;
    copyFragment.querySelector(".second__card-title-fourth").textContent = data.imdbRating;
    
    elFragment.append(copyFragment);
  })
  elResult.appendChild(elFragment);
};

// for render movie API
const renderMovies = async (movie, page=1)=> {
  try {
    if (elSelect.value === "Movie") {
      let respone = await fetch(`http://www.omdbapi.com/?s=${movie}&apikey=51f50317&page=${page}`);
      const data = await respone.json();
      renderMovie(data)
    } 
    if (elSelect.value === "series") {
      let respone = await fetch(`http://www.omdbapi.com/?t=${movie}&apikey=51f50317&Season=${page}`)
      const data = await respone.json();
      renderMovieSecond(data)
    }
    // console.log(respone);

    

  } catch (err) {
    renderErrors(err)
  }
    finally {
      elSpinner.classList.add("d-none");
    };
};

// for error
const renderErrors = function (error) {
  error = `movie not found`
  elError.innerHTML = `${error}`
};

// for spinner
function spinnnewerRemove() {
  elSpinner.classList.remove("d-none")
}

// to send the message to the list
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  elError.innerHTML='';
  elResult.innerHTML='';

  spinnnewerRemove()
  let inputVal = elInputTitel.value.trim().toLowerCase();
  let inputVall = elInputPage.value
  renderMovies(inputVal, inputVall);
});

// import { pixibuyApi } from './js/pixabay-api';
// // import { pixibuyApi } from './pixabay-api';
// import Notiflix from 'notiflix';

// const gallery = document.querySelector('.gallery');
// const searchFormEl = document.querySelector('.js-search-form');

// const pixibuyApi = new pixibuyApi();

// // pixibuyApi(name.hits);

// const onSearchFormSubmit = event => {
//   event.preventDefault();

//   pixibuyApi.query = event.currentTarget.elements['searchQuery'].value
//     .trim()
//     .toLowerCase();
//   pixibuyApi.page = 1;

//   pixibuyApi.fetchPhotos().then(({ data } = {}) => {
//     if (data.data.hits === 0) {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }
//   });

//   console.log(' hi:');
// };

// searchFormEl.addEventListener('submit', onSearchFormSubmit);

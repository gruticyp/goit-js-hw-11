import Notiflix from 'notiflix';
import { PixibuyApi } from './js/pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import axios from 'axios';

const formEl = document.querySelector('.js-search-form');
const inputEl = document.querySelector('.js-search-input');
const galleryEL = document.querySelector('.gallery');
const closeBtnEl = document.querySelector('.js-btn-close');
const loadMoreBtnEl = document.querySelector('.js-load-more-btn');

loadMoreBtnEl.style.display = 'none';

const pixibuyApi = new PixibuyApi();
// console.log('pixibuyApi :', pixibuyApi);

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

closeBtnEl.style.display = 'none';

inputEl.addEventListener('focus', () => {
  setTimeout(() => {
    closeBtnEl.style.display = 'block';
  }, 1000);
});

closeBtnEl.addEventListener('click', event => {
  inputEl.value = '';
  event.target.style.display = 'none';
});

inputEl.addEventListener('blur', () => {
  setTimeout(() => {
    closeBtnEl.style.display = 'none';
  }, 1000);
});

const onSearchFormSubmit = async event => {
  event.preventDefault();
  galleryEL.innerHTML = '';

  pixibuyApi.query = event.currentTarget.elements.searchQuery.value;
  //   console.log('query :', pixibuyApi.query);
  pixibuyApi.resetPage();
  try {
    const { data } = await pixibuyApi.fetchPhotos();
    // console.log('data :', data);
    if (data.totalHits === 0) {
      // console.log('data1 :', data.totalHits);
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.style.display = 'none';
    } else if (data.totalHits <= 40){
      loadMoreBtnEl.style.display = 'none';
      markupGalleryItems(data.hits);
      lightbox.refresh();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      //   console.log('data2 :', data.hits);
      markupGalleryItems(data.hits);
      lightbox.refresh();
      loadMoreBtnEl.style.display = 'none';
      loadMoreBtnEl.style.display = 'block';
      //   const { height: cardHeight } = document
      //     .querySelector('.gallery')
      //     .firstElementChild.getBoundingClientRect();
    }
  } catch (error) {
    console.log('error :', error);
  }
  pixibuyApi.incrementPage();
};

formEl.addEventListener('submit', onSearchFormSubmit);

// load more function

const onClickLoadMore = async () => {
  try {
    const { data } = await pixibuyApi.fetchPhotos();
    let totalPages = Math.ceil(data.totalHits / data.hits.length);
    // console.log(`Total pages: ${totalPages}`);
    if (totalPages === pixibuyApi.page + 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.style.display = 'none';
      markupGalleryItems(data.hits);
      lightbox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } else {
      markupGalleryItems(data.hits);
      lightbox.refresh();
      pixibuyApi.incrementPage();
      const { height: cardHeight } = document
        .querySelector('.container--gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log('error :', error);
  }
};

loadMoreBtnEl.addEventListener('click', onClickLoadMore);

// markup function
const markupGalleryItems = hits => {
  let markupItems = hits
    .map(hit => {
      return `<li class="photo-card">
        <a class="gallery__item" href="${hit.largeImageURL}">
        <img class="photo-card__img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=300 height=190/>
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${hit.downloads}
          </p>
        </div>
      </li>`;
    })
    .join('');
  return galleryEL.insertAdjacentHTML('beforeend', markupItems);
};

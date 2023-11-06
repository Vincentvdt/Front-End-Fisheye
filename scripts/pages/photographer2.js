const gallery = document.querySelector(".gallery");
const select = document.getElementById("mediasFilter");
const totalLikesElem = document.querySelector(".tarif");
const headerElement = document.querySelector(".photograph-header");
const nameElem = document.querySelector(".photograph-header__name");
const locationElem = document.querySelector(".photograph-header__location");
const taglineElem = document.querySelector(".photograph-header__tagline");
const imgElem = document.querySelector(
  ".photograph-header__profile-wrapper img"
);

const displayPhotographerPage = async () => {
  const photographerServices = await photographerService();
  const photographer = await photographerServices.getPhotographerByID(id);
  const medias = await photographerServices.getMedias(id);
};

await displayPhotographerPage();

let focusableElements = null;

const selectFocusableElementsExcept = (exceptElem) => {
  // Get all focusable elements on the page
  const focusableElements = document.querySelectorAll(
    ' img, video ,a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );

  // Get the modal element
  const modalElement = document.querySelector(exceptElem);

  // Filter out elements that are descendants of the modal
  return Array.from(focusableElements).filter((element) => {
    return !modalElement.contains(element);
  });
};

const init = async () => {
  const photographerServices = await photographerService();
  const photographer = await photographerServices.getPhotographerByID(id);
  const medias = await photographerServices.getMedias(id);
  let totalLike = 0;
  const calculateAndUpdateTotalLike = () => {
    totalLike = medias.reduce((a, b) => a + b.likes, 0);
    totalLikesElem.querySelector(".totalLikes p").textContent = totalLike;
  };
  calculateAndUpdateTotalLike();

  const populatePhotographInfos = (photographer) => {
    const { name, city, country, tagline, price, portrait } = photographer;
    const picture = `../assets/photographers/${portrait}`;

    totalLikesElem.querySelector(".price p").textContent = price;

    headerElement.classList.remove("await");
    nameElem.textContent = name;
    locationElem.textContent = `${city}, ${country}`;
    taglineElem.textContent = tagline;
    imgElem.src = picture;
    imgElem.alt = name;
  };

  const filterBy = (medias, sortType) => {};

  const sortMedia = () => {
    filterBy(medias, select.value);
    displayGallery(medias);
  };

  select.addEventListener("change", sortMedia);
  const likeCard = async (card) => {
    const id = card.getAttribute("id");
    const post = await photographerServices.getPostByID(id);

    if (!post.liked) {
      post.liked = true;
      post.likes++;
      card.classList.add("liked");
    } else {
      post.liked = false;
      post.likes--;
      card.classList.remove("liked");
    }
    card.querySelector(".gallery-card__likes p").textContent = post.likes;
    calculateAndUpdateTotalLike();
  };
  const displayGallery = async (medias) => {
    gallery.innerHTML = "";
    for (const [index, media] of Object.entries(medias)) {
      media.index = Number(index);
      const galleryModel = galleryCardTemplate(media);

      const cardDOM = await galleryModel.getGalleryCardDOM();
      cardDOM
        .querySelector(".likeBtn")
        .addEventListener("click", () => likeCard(cardDOM));
      gallery.appendChild(cardDOM);
    }
  };

  populatePhotographInfos(photographer);
  sortMedia();

  // Usage:
  focusableElements = selectFocusableElementsExcept("#contact_modal");
};
init();

const lightboxCloseBtn = document.querySelector(".close-lightbox_btn");
const lightbox = document.querySelector(".lightbox-modal");
const lightboxPrevBtn = document.querySelector(".carousel-arrow.arrow-prev");
const lightboxNextBtn = document.querySelector(".carousel-arrow.arrow-next");
const lightboxGallery = document.querySelector(".carousel-gallery");
focusableElements = selectFocusableElementsExcept(".lightbox-modal");

let index = 0;

const displayCarousel = async () => {
  const photographerServices = await photographerService();
  const medias = await photographerServices.getMedias(id);
  lightboxGallery.innerHTML = "";

  let media;

  if (medias[index].image) {
    const imgElem = document.createElement("img");
    imgElem.src = `assets/medias/${medias[index].image}`;
    imgElem.alt = medias[index].title;
    media = imgElem;
  } else if (medias[index].video) {
    const videoElem = document.createElement("video");
    videoElem.setAttribute("controls", "");
    videoElem.src = `assets/medias/${medias[index].video}`;
    videoElem.alt = medias[index].title;
    media = videoElem;
  }

  media.classList.add("carousel-item");
  lightboxGallery.appendChild(media);
};
const hiddenRestOfTheSite = () => {
  focusableElements.forEach(function (element) {
    // Traitez chaque élément ici
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("tabindex", "-1");
  });
};

const showRestOfTheSite = () => {
  focusableElements.forEach(function (element) {
    // Traitez chaque élément ici
    element.setAttribute("aria-hidden", "false");
    element.removeAttribute("tabindex");
  });
};
const openLightbox = () => {
  body.classList.add("no-scroll");
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  lightboxNextBtn.focus();
  displayCarousel();
  hiddenRestOfTheSite();
};
const closeLightbox = () => {
  body.classList.remove("no-scroll");
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");

  showRestOfTheSite();
};

lightboxCloseBtn.addEventListener("click", closeLightbox);
lightboxPrevBtn.addEventListener("click", (e) => {
  e.preventDefault();
  index--;
  displayCarousel();
});
lightboxNextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  index++;
  displayCarousel();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeLightbox();
  }
});

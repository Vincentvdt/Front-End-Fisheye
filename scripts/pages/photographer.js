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

const main = document.querySelector("main");
const header = document.querySelector("header");
const tarif = document.querySelector(".tarif");

const params = new URL(document.location).searchParams;
const id = params.get("id");

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

  const filterBy = (medias, sortType) => {
    medias.sort((a, b) => {
      switch (sortType) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "popularity":
          return b.likes - a.likes;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const sortMedia = async () => {
    filterBy(medias, select.value);
    await displayGallery(medias);
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
  await sortMedia();
};
document.addEventListener("DOMContentLoaded", init);

const lightboxCloseBtn = document.querySelector(".close-lightbox_btn");
const lightbox = document.querySelector(".lightbox-modal");
const lightboxPrevBtn = document.querySelector(".carousel-arrow.arrow-prev");
const lightboxNextBtn = document.querySelector(".carousel-arrow.arrow-next");

const hiddenRestOfTheSite = () => {
  main.setAttribute("aria-hidden", "true");
  header.setAttribute("aria-hidden", "true");
  tarif.setAttribute("aria-hidden", "true");
};

const showRestOfTheSite = () => {
  main.setAttribute("aria-hidden", "false");
  header.setAttribute("aria-hidden", "false");
  tarif.setAttribute("aria-hidden", "false");
};
const openLightbox = () => {
  body.classList.add("no-scroll");
  lightbox.style.display = "flex";
  lightbox.setAttribute("aria-hidden", "false");
  lightboxNextBtn.focus();

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
});
lightboxNextBtn.addEventListener("click", (e) => {
  e.preventDefault();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeLightbox();
  }
});

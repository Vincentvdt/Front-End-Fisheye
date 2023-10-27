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

init();

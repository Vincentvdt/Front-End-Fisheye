const gallery = document.querySelector(".gallery");
const select = document.getElementById("mediasFilter");

let medias = null;
let photographer = null;

const params = new URL(document.location).searchParams;
const id = params.get("id");
const fetchData = async (url) => {
  const res = await fetch(url);
  return await res.json();
};

const main = async () => {
  const datas = await fetchData("../../data/photographers.json");
  const getPhotographerByID = async (id) => {
    if (!photographer) {
      photographer = datas.photographers.find(
        (photograph) => photograph.id === parseInt(id)
      );
    }
    return photographer;
  };

  const getMedias = async (id) => {
    if (!medias) {
      medias = datas.media.filter(
        (media) => media.photographerId === parseInt(id)
      );
    }
    return medias;
  };

  const populatePhotographHeader = (photographer) => {
    const picture = `../assets/photographers/${photographer.portrait}`; // Modifié le chemin d'accès

    const headerElement = document.querySelector(".photograph-header");
    const nameElem = document.querySelector(".photograph-header__name");
    const locationElem = document.querySelector(".photograph-header__location");
    const taglineElem = document.querySelector(".photograph-header__tagline");
    const imgElem = document.querySelector(
      ".photograph-header__profile-wrapper img"
    );

    headerElement.classList.remove("await");
    nameElem.textContent = photographer.name;
    locationElem.textContent = `${photographer.city}, ${photographer.country}`;
    taglineElem.textContent = photographer.tagline;
    imgElem.src = picture;
    imgElem.alt = photographer.name;
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

  const displayGallery = async (medias) => {
    gallery.innerHTML = "";

    for (const [index, media] of Object.entries(medias)) {
      const galleryModel = galleryCardTemplate(media);
      const cardDOM = await galleryModel.getGalleryCardDOM();
      gallery.appendChild(cardDOM);
    }
  };

  await getPhotographerByID(id);
  await getMedias(id);

  populatePhotographHeader(photographer);
  await sortMedia();
};

main();

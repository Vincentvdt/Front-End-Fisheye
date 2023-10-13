const mainDOM = document.querySelector("main");
const gallery = document.querySelector(".gallery");

const params = new URL(document.location).searchParams;
const id = params.get("id");

const getPhotographer = async (id) => {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();

  return data.photographers.find(
    (photograph) => photograph.id === parseInt(id)
  );
};

const getPhotographerMedia = async (id) => {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();

  return data.media.filter((media) => media.photographerId === parseInt(id));
};

const getGalleryCardDom = async (card) => {
  const path = ` ../../assets/medias/${card.image || card.video}`;
  const media = card.image
    ? `<img alt="${card.title}" src="${path}">`
    : card.video
    ? `<video controls>
      <source src="${path}" type="video/mp4"/>
    </video>`
    : "";

  const cardHTML = `
    <article id="${card.photographerId}-${card.id}" class="gallery-card">
      <a href="#" class="gallery-card__media">
        ${media}
      </a>
      <div class="gallery-card__description">
        <h3 class="gallery-card__title">${card.title}</h3>
        <div class="gallery-card__likes">
          <p>${card.likes}</p>
          <svg fill="none" height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 18.85L8.23125 17.53C3.725 12.86 0.75 9.78 0.75 6C0.75 2.92 2.8675 0.5 5.5625 0.5C7.085 0.5 8.54625 1.31 9.5 2.59C10.4538 1.31 11.915 0.5 13.4375 0.5C16.1325 0.5 18.25 2.92 18.25 6C18.25 9.78 15.275 12.86 10.7687 17.54L9.5 18.85Z" fill="#911C1C"/>
          </svg>
        </div>
      </div>
    </article>
  `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(cardHTML, "text/html");
  return doc.body.firstChild;
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
  return medias.sort((a, b) => {
    switch (sortType) {
      case "date":
        return new Date(a.date) - new Date(b.date);
      case "popularity":
        return b.likes - a.likes;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0; // No sorting by default
    }
  });
};

const sortMedia = async () => {
  const medias = await getPhotographerMedia(id);
  const select = document.getElementById("mediasFilter");
  const sortedMedias = filterBy(medias, select.value);
  await displayGallery(sortedMedias);
};

const displayGallery = async (medias) => {
  gallery.innerHTML = "";
  for (const media of medias) {
    const mediaDom = await getGalleryCardDom(media);
    gallery.appendChild(mediaDom);
  }
};

const main = async () => {
  const photographer = await getPhotographer(id);
  const medias = await getPhotographerMedia(id);
  await displayGallery(medias);

  populatePhotographHeader(photographer);
};

main();

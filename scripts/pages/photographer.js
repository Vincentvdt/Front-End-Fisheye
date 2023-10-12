const mainDOM = document.querySelector("main");

const params = new URL(document.location).searchParams;
const id = params.get("id");

const getPhotographer = async (id) => {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();

  return data.photographers.find(
    (photograph) => photograph.id === parseInt(id)
  );
};

const populatePhotographHeader = (photographer) => {
  const picture = `../assets/photographers/${photographer.portrait}`;

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
const main = async () => {
  const photographer = await getPhotographer(id);

  populatePhotographHeader(photographer);
};

main();

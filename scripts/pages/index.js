const getPhotographers = async () => {
  const response = await fetch("../../data/photographers.json");
  const data = await response.json();

  return data.photographers;
};

const displayData = async (photographers) => {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
};

const init = async () => {
  const photographers = await getPhotographers();
  displayData(photographers);
};

init();

// TODO:  - Center card content
//        - Refractoring cards links, only the img and the name in the link
//        - ESLINT, Basic configuration
//        - NPM install local, not just global
//        - Lightbox, show position in the carrousel
//        - Refractoring photographer.js functions

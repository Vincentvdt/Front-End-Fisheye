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

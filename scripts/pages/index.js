const displayData = async (photographers) => {
  const photographersSection = document.querySelector(".photographer_section");

  for (const photographer of photographers) {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  }
};

const init = async () => {
  const services = await photographerService();
  const photographers = await services.getAllPhotographers();
  await displayData(photographers);
};

init();

// TODO:  - Center card content
//        - Refractoring cards links, only the img and the name in the link
//        - ESLINT, Basic configuration
//        - NPM install local, not just global
//        - Lightbox, show position in the carrousel
//        - ARIA FIGMA
//        - Validation form + navigation
//        - aria hidden when modal or lightbox is opened

const displayData = async (photographers) => {
  const photographersSection = document.querySelector(".photographer_section");

  for (const photographer of photographers) {
    // eslint-disable-next-line no-undef
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  }
};

const init = async () => {
  // eslint-disable-next-line no-undef
  const services = await photographerService();
  const photographers = await services.getAllPhotographers();
  await displayData(photographers);
};

init().then(() => "success");

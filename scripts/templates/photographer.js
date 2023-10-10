const photographerTemplate = (data) => {
  const { id, name, city, country, tagline, price, portrait } = data;

  const picture = `../assets/photographers/${portrait}`;
  const getUserCardDOM = () => {
    const htmlString = `
    <article id="${id}" class="profile-card">
      <a href="photographer.html?id=${id}" aria-label="Lien vers le profil de ${name}">      
        <div class="profile-card__image">
          <img src="${picture}" alt="${name}">
        </div>
        <div class="profile-card__details">
          <h2>${name}</h2>
          <div class="profile-card__info">
            <p class="profile-location">${city}, ${country}</p>
            <p class="profile-tagline">${tagline}</p>
            <p class="profile-price" aria-label="Cout journalier">${price}€/jour</p>
          </div>
        </div>
      </a>
    </article>
  `;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.firstChild;
  };
  return { name, picture, getUserCardDOM };
};

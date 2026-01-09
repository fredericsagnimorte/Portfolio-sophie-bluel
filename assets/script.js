// Récupération des traveaux depuis l'API
const reponseWorks = await fetch('http://localhost:5678/api/works');
const works = await reponseWorks.json();
// console.log(works);

// récupération des Catégories
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();
// console.log(categories);

// Suppressions des éléments dans la <div class="gallery">
const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";

// Ajout dynamique des éléments
for (let work of works) {
    const imageUrl = work.imageUrl;
    const title = work.title;
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
				        <figcaption>${title}</figcaption>`;
    gallery.appendChild(figure);
    // console.log(work)
}
// console.log(gallery);


// Ajout des filtres
const filtres = document.querySelector(".filtres");

// Ajout du filtre "Tous"
const filtreTous = document.createElement("button");
filtreTous.innerHTML = `Tous`;
filtreTous.classList.add("selected");
filtreTous.id = "0";
filtres.appendChild(filtreTous);

// Ajout des autres filtres
for (let categorie of categories) {
    const idCategorie = categorie.id;
    const title = categorie.name;
    const filtre = document.createElement("button")
    filtre.innerHTML = `${title}`;
    filtre.id = `${idCategorie}`;
    filtres.appendChild(filtre);
    // console.log(filtre);
};

// console.log(filtres);

// Détection des elements au clic
const buttons = filtres.children;


for (let button of buttons) {
    button.addEventListener("click", (event) => {
        for (let btn of buttons) {
            btn.classList.remove("selected");
        }
        event.target.classList.add("selected");
    });
};


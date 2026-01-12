// import des fonctions
import { addfilters,isConnected,connectedElements,logout } from "./fonctions.js";

// Vérification de la connexion d'un utilisateur
const token = isConnected();

// Récupération des traveaux depuis l'API
const reponseWorks = await fetch('http://localhost:5678/api/works');
const works = await reponseWorks.json();

// récupération des Catégories
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

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
};

// Ajout des filtres
const filtres = addfilters(token,categories);

// Affichage des éléments si l'utilisateur est connecté
connectedElements(token);

// Déconnexion
logout(token);

// Détection des elements au clic
const buttons = filtres.children;


for (let button of buttons) {
    button.addEventListener("click", (event) => {
        for (let btn of buttons) {
            btn.classList.remove("selected");
        }
        event.target.classList.add("selected");

        // Remise à 0 de l'affichage des éléments
        gallery.innerHTML = "";

        // Ajout dynamique des éléments en fonction du filtre
        if (event.target.id === "0") {
            for (let work of works) {
                const imageUrl = work.imageUrl;
                const title = work.title;
                const figure = document.createElement("figure");
                figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
                            <figcaption>${title}</figcaption>`;
                gallery.appendChild(figure);
            };
        } else {
            for (let work of works) {
                if (work.category.id === Number(event.target.id)) {
                    const imageUrl = work.imageUrl;
                    const title = work.title;
                    const figure = document.createElement("figure");
                    figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
                             <figcaption>${title}</figcaption>`;
                    gallery.appendChild(figure);
                };
            };
        };
    });
};


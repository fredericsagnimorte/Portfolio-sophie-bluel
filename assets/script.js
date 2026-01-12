// import des fonctions
import { addfilters,isConnected,connectedElements,logout,changeFilter } from "./fonctions.js";

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
changeFilter(token,filtres);



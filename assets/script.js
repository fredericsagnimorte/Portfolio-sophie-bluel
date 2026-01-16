// import des fonctions
import {
    affichageImg, addfilters, isConnected, connectedElements, logout, changeFilter,
    initAddEventListenerPopup
} from "./fonctions.js";

// Vérification de la connexion d'un utilisateur
const token = isConnected();

// Récupération des traveaux depuis l'API
// const reponseWorks = await fetch('http://localhost:5678/api/works');
// const works = await reponseWorks.json();

// récupération des Catégories
const reponseCategories = await fetch('http://localhost:5678/api/categories');
const categories = await reponseCategories.json();

// Ajout dynamique des éléments
affichageImg();

// Ajout des filtres
const filtres = addfilters(token, categories);

// Affichage des éléments si l'utilisateur est connecté
connectedElements(token);

// Déconnexion
logout(token);

// Détection des elements au clic
changeFilter(token, filtres);

//afficher ou cacher la popup la popup de modification
initAddEventListenerPopup(token);


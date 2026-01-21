// import des fonctions
import {
    affichageImg, addfilters, isConnected, connectedElements, setupLogout, changeFilter,
    initAddEventListenerPopup
} from "./fonctions.js";

// Vérification de la connexion d'un utilisateur
const token = isConnected();

// Récupération des traveaux depuis l'API
// const reponseWorks = await fetch('http://localhost:5678/api/works');
// const works = await reponseWorks.json();


// Ajout dynamique des éléments
affichageImg();

// Ajout des filtres
const filtres = await addfilters(token);

// Affichage des éléments si l'utilisateur est connecté
connectedElements(token);

// Déconnexion
setupLogout(token);

// Détection des elements au clic
changeFilter(token, filtres);

//afficher ou cacher la popup la popup de modification
initAddEventListenerPopup(token);


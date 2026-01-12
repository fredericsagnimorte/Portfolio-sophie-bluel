// import des fonctions
import {login } from "./fonctions.js"

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    // suppression du rechargement de la page
    event.preventDefault();

    // recuperation des elements
    const email = event.target.querySelector("input#email-login").value;
    const password = event.target.querySelector("input#password").value;

    // envoi et traitement de la réponse
    login(email,password)
    
});
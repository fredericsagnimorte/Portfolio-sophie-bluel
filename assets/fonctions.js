/**
 * cette fonction permet de vérifier si un utilisateur est connecté
 * @returns {boolean} : true si l'utilisateur est connecté,
 * false si l'utilisateur n'est pas connecté
 */
export function isConnected() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
        return true;
    } else {
        return false;
    }
};

export async function affichageImg() {
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();

    // Suppressions des éléments dans la <div class="gallery">
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let work of works) {
        const imageUrl = work.imageUrl;
        const title = work.title;
        const figure = document.createElement("figure");
        figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
                            <figcaption>${title}</figcaption>`;
        gallery.appendChild(figure);
    };
};

export async function addfilters(token) {
    // Affichage des filtres que si l'utilisateur n'est pas connecté
    if (!token) {

        // récupération des Catégories
        const reponseCategories = await fetch('http://localhost:5678/api/categories');
        const categories = await reponseCategories.json();

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
        };
        console.log(filtres)
        return filtres;
    };
};

/**
 * Cette fonction change la page si il y a un token (connexion ou non)
 * @param {bool} token : prend en entrer la présence ou non du token
 */
export function connectedElements(token) {
    if (token === true) {
        //création du bandeau d'edition
        const editBanner = document.createElement("div");
        editBanner.classList.add("edit-banner");
        editBanner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
			                    <p>Mode édition</p>`;
        const body = document.querySelector("body");
        // Ajout du bandeau au début du body
        body.prepend(editBanner);
        // Modification du bouton login en logout
        const loginBtn = document.querySelector(".loginBtn");
        loginBtn.innerHTML = `<a href="./index.html">logout</a>`;
        loginBtn.classList.add("logoutBtn");
        loginBtn.classList.remove("loginBtn");

        // Ajout du bouton de modification
        const modifyBtn = document.createElement("button");
        modifyBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>
                            modifier`;
        const portfolioHeader = document.querySelector(".portfolio-header");
        portfolioHeader.appendChild(modifyBtn);
    };
};

export function logout(token) {
    if (token) {
        const logoutBtn = document.querySelector(".logoutBtn");
        logoutBtn.addEventListener("click", () => {
            // Suppression du token et de l'ID pour déconnexion
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
        });
    };
};

export async function changeFilter(token, filtres) {
    if (!token) {
        const reponseWorks = await fetch('http://localhost:5678/api/works');
        const works = await reponseWorks.json();
        const gallery = document.querySelector(".gallery");
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
    };
};

/**
 * Cette fonction initialise les écouteurs d'événements qui concernent 
 * l'affichage de la popup. 
 * @param {boolean} token : permet de savoir si l'utilisateur est connecté
 */
export function initAddEventListenerPopup(token) {
    if (token) {
        // On écoute le click sur le bouton "modifier"
        const modifyBtn = document.querySelector(".portfolio-header button");
        const popupBackground = document.querySelector(".popupBackground");
        modifyBtn.addEventListener("click", () => {
            afficherPopup();
        });


        // On écoute le click sur la div "popupBackground"
        popupBackground.addEventListener("click", (event) => {
            if (event.target === popupBackground) {
                cacherPopup();
            };
        });

        const xmark = document.querySelector(".popupBanner .xmark");
        // On écoute le click sur la croix
        xmark.addEventListener("click", () => {
            cacherPopup();
        });
    };
};

/**
 * Cette fonction affiche la popup . 
 * @param {Element} works : éléments à afficher
 */
function afficherPopup() {
    const popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.add("active");
    afficheTitleGallery();
    afficheImgGallery();
    addEventListenerChangeAffichage();
    addEventListenerGoBack();
};

/**
 * Cette fonction cache la popup. 
 */
function cacherPopup() {

    const popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.remove("active");

    if (document.querySelector(".popup .sendPhoto")) {
        turnBackAddPhotoBtn();
    }
};

async function afficheImgGallery() {
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();

    // Suppression des elements de "popupGallery"
    document.querySelector(".popupMain").innerHTML = "";

    // Enlève la class "lock" du bouton si présente
    document.querySelector(".popup .addPhoto").removeAttribute("disabled");

    const popupMain = document.querySelector(".popupMain");
    const popupGallery = document.createElement("div");
    popupGallery.classList.add("popupGallery");
    popupMain.appendChild(popupGallery);


    // Ajout des images dans "popupGallery"
    for (let work of works) {

        const imageUrl = work.imageUrl;
        const title = work.title;
        const figure = document.createElement("figure");
        figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
				        <i class="fa-solid fa-trash-can"></i>`;
        popupGallery.appendChild(figure);
    };


    addEventListenerSupprImg();
};

/**
 * change le titre de la gallery
 */
function afficheTitleGallery() {
    document.querySelector(".popupBanner h2").innerHTML = "Galerie photo";
};

/**
 * change le titre de la gallery
 */
function afficheTilteModify() {
    document.querySelector(".popupBanner h2").innerHTML = "Ajout photo"
};

async function afficheAddImg() {
    const reponseCategories = await fetch('http://localhost:5678/api/categories');
    const categories = await reponseCategories.json();

    // ajout de la partie "ajout d'image"
    const btn = document.querySelector(".popup .addPhoto")
    document.querySelector(".popupMain").innerHTML =
        `<div class="formImg">
            <div class="upload-box">
                <label for="imageUpload" class="upload-label">
                    <div class="upload-content">
                        <img src="./assets/icons/icon-image.svg" alt="" class="upload-icon">
                        <span class="upload-button">+ Ajouter photo</span>
                        <p class="upload-info">jpg, png : 4Mo max</p>
                    </div>
                </label>
                <input type="file" id="imageUpload" name="image" accept="image/png, image/jpeg" hidden>
                <img id="thumbnail" alt="Aperçu">
            </div>
        <div>				
            <label for="titre">Titre</label>
            <input type="text" name="titre" id="titre">
        </div>
        <div>
            <label for="categorie">Catégorie</label>
            <select id="category" name="category">
                <option value="0">-- Choisir une catégorie --</option>
            </select>             
        </div>
    </div>
    <p class="error-message hidden">Il manque un élément.</p>`;

    const select = document.querySelector("#category")

    // Ajout des catégorie
    for (let categorie of categories) {
        const idCategorie = categorie.id;
        const title = categorie.name;
        const option = document.createElement("option");
        option.value = idCategorie
        option.innerHTML = `${title}`
        select.appendChild(option);
    };

    // afficher l'image en mignature si selectionnée
    const input = document.querySelector("#imageUpload");
    const thumbnail = document.querySelector("#thumbnail");

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;

        // Vérification optionnelle
        if (!file.type.startsWith("image/jpg") && !file.type.startsWith("image/png")) {
            alert("Le fichier doit être une image jpg ou png.");
            return;
        }

        thumbnail.src = URL.createObjectURL(file);
        thumbnail.style.display = "block";
    });

    // modification du bouton
    document.querySelector(".arrow-left").classList.add("active");
    btn.classList.add("sendPhoto");
    btn.setAttribute("disabled", "");
    btn.classList.remove("addPhoto");
    btn.innerHTML = "Valider";

    // recuperation des éléments à vérifier
    const inputImage = document.querySelector("#imageUpload");
    const inputText = document.querySelector("#titre");
    const selectCategorie = document.querySelector("#category");

    inputImage.addEventListener("change", () => { addEventListenerIsAllToSend() });
    inputText.addEventListener("change", () => { addEventListenerIsAllToSend() });
    selectCategorie.addEventListener("change", () => { addEventListenerIsAllToSend() });


};

/**
 * Choisi l'image à supprimer
 */
async function addEventListenerSupprImg() {

    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();
    const supprImgs = document.querySelectorAll(".popupGallery .fa-trash-can");
    for (let i = 0; i < supprImgs.length; i++) {
        supprImgs[i].addEventListener("click", async () => {
            await deleteWork(works[i].id);


            // raffraichissement de l'affichage
            afficheImgGallery();
            affichageImg();
        });
    };
};

/**
 * permet de changer l'affichage du popup ou envoyer une image
 */
function addEventListenerChangeAffichage() {
    const addImgBtn = document.querySelector(".addPhoto");

    addImgBtn.addEventListener("click", () => {
        if (addImgBtn.classList.contains("addPhoto")) {
            afficheTilteModify();
            afficheAddImg();
        } else if (addImgBtn.classList.contains("sendPhoto")) {
            // vérification de la présence des tout les éléments 
            // ou affichage d'un message d'erreur
            const inputImage = document.querySelector("#imageUpload");
            const inputText = document.querySelector("#titre");
            const selectCategorie = document.querySelector("#category");
            const image = inputImage.files[0];
            const titre = escapeHTML(inputText.value);
            const categorie = selectCategorie.value;
            if (image && titre && categorie != "0") {
                addAndRefresh(image, titre, categorie);
            };
        };
    });
};

function escapeHTML(str) {
    return str
        .replace(/\\/g, "&#92;")
        .replace(/\//g, "&#47;")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function addAndRefresh(image, titre, categorie) {
    // ajout de l'image
    await addWork(image, titre, categorie);

    // remise en place du bouton ajouter photo
    turnBackAddPhotoBtn();
    cacherPopup();
    affichageImg();
};

function addEventListenerIsAllToSend() {
    const inputImage = document.querySelector("#imageUpload");
    const inputText = document.querySelector("#titre");
    const selectCategorie = document.querySelector("#category");
    const errorMsg = document.querySelector("p.error-message")

    const image = inputImage.files[0];
    const titre = inputText.value;
    const categorie = selectCategorie.value;
    const addImgBtn = document.querySelector(".sendPhoto");

    if (image && titre && categorie != "0") {
        addImgBtn.removeAttribute("disabled");
        errorMsg.classList.add("hidden");

    } else {
        addImgBtn.setAttribute("disabled", "");
        errorMsg.classList.remove("hidden");
    }
};


/**
 * revien sur l'affichage de suppression des images
 */
function addEventListenerGoBack() {
    const goBackbtn = document.querySelector(".arrow-left");
    goBackbtn.addEventListener("click", () => {

        document.querySelector(".popupMain").innerHTML = ``;
        afficheTitleGallery();
        afficheImgGallery();
        turnBackAddPhotoBtn()
    });
};

function turnBackAddPhotoBtn() {
    const btn = document.querySelector(".popup .sendPhoto");
    document.querySelector(".arrow-left").classList.remove("active");
    btn.classList.add("addPhoto");
    btn.removeAttribute("disabled");
    btn.classList.remove("sendPhoto");
    btn.innerHTML = "Ajouter une photo";
}

/**
 * supprime l'image id
 * @param {value} id : id de l'image à supprimer
 */
async function deleteWork(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} lors de la suppression`);
    }
    return true;
};

async function addWork(image, titre, categorie) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", titre);
    formData.append("category", categorie);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });


    if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du projet");
    };

    return response.json();
};



// fonctions sur la page de connexion


/**
 * cette fonction permet la connexion des utilisateurs
 * @param {string} email : e-mail de connexion saisi
 * @param {string} password : mot de passse saisi
 */
export async function login(email, password) {
    // envoi des informations
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    // recupération des informations
    const infos = await reponse.json();

    // traitement des différents retours 
    if (infos.token) {
        // recupération du token et ajout en stockage local
        localStorage.setItem("userId", infos.userId);
        localStorage.setItem("token", infos.token);
        document.querySelector(".error-message").classList.add("hidden");
        window.location.replace("index.html");

    } else {
        // affichage du message d'erreur
        document.querySelector(".error-message").classList.remove("hidden");
    }
};
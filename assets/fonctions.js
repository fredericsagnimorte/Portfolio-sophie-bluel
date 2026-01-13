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
        // console.log(work)
    };
};

export function addfilters(token, categories) {
    // Affichage des filtres que si l'utilisateur n'est pas connecté
    if (!token) {
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

export function changeFilter(token, filtres) {
    if (!token) {
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
 * @param {Element} works : éléments à afficher
 */
export function initAddEventListenerPopup(token) {

    // On écoute le click sur le bouton "modifier"
    const modifyBtn = document.querySelector(".portfolio-header button");
    const popupBackground = document.querySelector(".popupBackground");
    modifyBtn.addEventListener("click", () => {
        if (token) {
            afficherPopup();
        };
    });

    // On écoute le click sur la div "popupBackground"
    popupBackground.addEventListener("click", (event) => {
        if (event.target === popupBackground) {
            cacherPopup();
        };
    });

    const xmark = document.querySelector(".popupBanner .fa-xmark");
    // On écoute le click sur la croix
    xmark.addEventListener("click", () => {
        cacherPopup();
    });
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
    addEventListenerSupprImg();
};

/**
 * Cette fonction cache la popup. 
 */
function cacherPopup() {
    const popupBackground = document.querySelector(".popupBackground");
    popupBackground.classList.remove("active");

    // Suppression des elements de "popupGallery"
    document.querySelector(".popupMain").innerHTML = "";
};

async function afficheImgGallery() {
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();

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


/**
 * Choisi l'image à supprimer
 */
async function addEventListenerSupprImg() {

    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();
    const supprImgs = document.querySelectorAll(".popupGallery .fa-trash-can");
    console.log(supprImgs)
    for (let i = 0; i < supprImgs.length; i++) {
        supprImgs[i].addEventListener("click", () => {
            deleteWork(works[i].id);
        });
    };
};

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


    // raffraichissement de l'affichage
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    const works = await reponseWorks.json();
    document.querySelector(".popupMain").innerHTML = "";
    afficheImgGallery();
    affichageImg();
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
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
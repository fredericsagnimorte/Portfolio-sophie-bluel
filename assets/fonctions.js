export function addfilters(token,categories) {
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
        loginBtn.innerHTML = "logout";
        loginBtn.classList.add("logoutBtn");
        loginBtn.classList.remove("loginBtn");

        //suppression des filtres

    };
};

export function logout(token) {
    if (token) {
        const logoutBtn = document.querySelector(".logoutBtn");
        logoutBtn.addEventListener("click", () => {
            // Suppression du token et de l'ID pour déconnexion
            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            // rafraichissement de la page
            window.location.href = "index.html";
        });
    };
};
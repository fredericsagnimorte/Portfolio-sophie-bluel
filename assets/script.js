// Récupération des traveaux depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const works = await reponse.json();
console.log(works);

// Suppressions des éléments dans la <div class="gallery">
const gallery = document.querySelector(".gallery");

// Ajout dinamique des éléments
gallery.innerHTML = "";
for (let work of works) {
    let imageUrl = work.imageUrl
    const title = work.title
    const figure = document.createElement("figure")
    figure.innerHTML = `<img src="${imageUrl}" alt="${title}">
				        <figcaption>${title}</figcaption>`;
    gallery.appendChild(figure);
    // console.log(work)
}
// console.log(gallery);
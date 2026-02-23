const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById('snap');
const foldersGrid = document.getElementById('folders-grid');
const photosGrid = document.getElementById('photos-grid');
const foldersView = document.getElementById('folders-view');
const galleryView = document.getElementById('gallery-view');
const folderTitle = document.getElementById('folder-title');

// Lancer la webcam
navigator.mediaDevices.getUserMedia({ video: true }).then(s => video.srcObject = s);

snap.onclick = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const photo = canvas.toDataURL('image/jpeg', 0.7);
    const date = new Date().toLocaleString('fr-FR');
    
    sauvegarder(photo, date);
};

function sauvegarder(img, date) {
    let db = JSON.parse(localStorage.getItem('my_folders')) || [];
    
    // On demande si c'est quelqu'un de nouveau
    let prenom = prompt("À qui appartient ce visage ? (Entrez le prénom)");
    if (!prenom) return;

    // Chercher si le dossier existe déjà
    let folder = db.find(f => f.nom.toLowerCase() === prenom.toLowerCase());

    if (folder) {
        // Ajouter la photo au dossier existant
        folder.items.push({ img, date });
        alert("Photo ajoutée au dossier de " + folder.nom);
    } else {
        // Créer un nouveau dossier
        db.push({
            nom: prenom,
            items: [{ img, date }]
        });
        alert("Nouveau dossier créé pour " + prenom);
    }

    localStorage.setItem('my_folders', JSON.stringify(db));
    renderFolders();
}

function renderFolders() {
    foldersGrid.innerHTML = "";
    let db = JSON.parse(localStorage.getItem('my_folders')) || [];

    db.forEach(folder => {
        const div = document.createElement('div');
        div.className = "folder";
        div.onclick = () => ouvrirDossier(folder.nom);
        div.innerHTML = `<strong>${folder.nom}</strong><span>${folder.items.length} photos</span>`;
        foldersGrid.appendChild(div);
    });
}

function ouvrirDossier(nom) {
    let db = JSON.parse(localStorage.getItem('my_folders')) || [];
    let folder = db.find(f => f.nom === nom);
    
    folderTitle.innerText = "Dossier : " + nom;
    photosGrid.innerHTML = "";
    
    folder.items.forEach(item => {
        const card = document.createElement('div');
        card.className = "photo-card";
        card.innerHTML = `<img src="${item.img}"><span>📅 ${item.date}</span>`;
        photosGrid.appendChild(card);
    });

    foldersView.style.display = "none";
    galleryView.style.display = "block";
}

function fermerDossier() {
    galleryView.style.display = "none";
    foldersView.style.display = "block";
}

// Init au chargement
renderFolders();

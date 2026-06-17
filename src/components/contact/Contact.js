import getTemplate from "./template";

export default class Contact {
  constructor(data, onContactUpdate, onContactDelete) {
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
    this.createdAt = data.createdAt;
    //Initialiser l'état d'édition
    this.isEditing = false;
    //On garde de côté le callback de modification
    this.onContactUpdate = onContactUpdate;
    //Callback de suppression
    this.onContactDelete = onContactDelete;
    //On stocke l'élément HTML
    this.element = document.createElement("tr");
    //On utilise l'écouteur ici
    this.initEvents();
  }
  render(el) {
    //On applique le style de la ligne à chaque affichage
    this.element.className = "border-b border-gray-100 hover:bg-gray-50";
    //On injecte le contenu (les <td>) à l'intérieur du <tr>
    this.element.innerHTML = getTemplate(this);
    //Si la ligne n'est pas encore visible dans le tableau, on l'ajoute
    if (el && !el.contains(this.element)) {
      el.append(this.element);
    }
  }
  initEvents() {
    //Modification
    this.element.addEventListener("click", (e) => {
      // 1. Si clic sur le bouton Modifier (jaune)
      if (e.target.closest(".btn-edit")) {
        this.isEditing = true;
        this.render(); // On rafraîchit l'affichage
      }
      
      // 2. Si clic sur le bouton Valider (vert)
      else if (e.target.closest(".btn-check")) {
        // 1. On extrait les données du DOM (uniquement le rôle du composant)
        const updatedData = { 
          id: this.id, 
          firstname: this.element.querySelector(".input-firstname").value, 
          lastname: this.element.querySelector(".input-lastname").value, 
          email: this.element.querySelector(".input-email").value 
        };
        
        this.isEditing = false;

        // 2. On envoie TOUT à la liste. C'est elle qui modifiera la mémoire.
        if (this.onContactUpdate) {
          this.onContactUpdate(updatedData);
        }
      }
      //Suppression
      else if (e.target.closest(".btn-delete")) {
        // Avant de supprimer, demander une confirmation
        if (confirm(`Voulez-vous vraiment supprimer ${this.firstname} ${this.lastname} ?`)) {
          // On appelle le callback pour le supprimer de l'API et du tableau global
          if (this.onContactDelete) {
            this.onContactDelete(this.id);
          }
        }
      }
    });
  }
}
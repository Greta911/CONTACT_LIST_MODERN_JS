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
        // On récupère les valeurs directement
        this.firstname = this.element.querySelector(".input-firstname").value;
        this.lastname = this.element.querySelector(".input-lastname").value;
        this.email = this.element.querySelector(".input-email").value;
        
        this.isEditing = false;
        this.render(); // On repasse en mode normal

        // On appelle le callback pour l'API
        if (this.onContactUpdate) {
          this.onContactUpdate({ id: this.id, firstname: this.firstname, lastname: this.lastname, email: this.email });
        }
      }
      //Suppression
      else if (e.target.closest(".btn-delete")) {
        // Avant de supprimer, demander une confirmation
        if (confirm(`Voulez-vous vraiment supprimer ${this.firstname} ${this.lastname} ?`)) {
          // On retire visuellement la ligne du DOM tout de suite pour l'effet immédiat
          this.element.remove();
          
          // On appelle le callback pour le supprimer de l'API et du tableau global
          if (this.onContactDelete) {
            this.onContactDelete(this.id);
          }
        }
      }
    });
  }
}
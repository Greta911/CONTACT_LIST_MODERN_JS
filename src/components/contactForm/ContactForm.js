import getTemplate from "./template";

export default class ContactForm {
  constructor(containerSelector, onContactAdd) {
    this.container = document.querySelector(containerSelector);
    this.onContactAdd = onContactAdd; // C'est la fonction de la liste qu'on garde de côté, le famous CALLBACK de main.js
    this.render();
  }

  render() {
    this.container.innerHTML = getTemplate();
    
    // On écoute le submit 
    this.container.querySelector("#form-add-contact")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        
        // On récupère les valeurs
        const newContactData = {
          firstname: this.container.querySelector("#input-firstname").value,
          lastname: this.container.querySelector("#input-lastname").value,
          email: this.container.querySelector("#input-email").value,
        };

        // On appelle la fonction de la liste en lui passant les données: ici on déclenche le CALLBACK
        this.onContactAdd(newContactData);

        // Reset le formulaire ici
        e.target.reset();
      });
  }
}
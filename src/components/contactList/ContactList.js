import DB from "../../DB";
import Contact from "../contact/Contact";
import getTemplate from "./template";

export default class ContactList {
  constructor(data) {
    this.domElt = document.querySelector(data.el);
    DB.setApiURL(data.apiURL);
    this.contacts = [];
    this.domElt.innerHTML = getTemplate();
    this.loadContacts();
  }
  async loadContacts() {
    const contacts = await DB.findAll();
    this.contacts = contacts.map((contact) => new Contact(contact));
    this.render();
  }
  async addNewContact(newContactData) {
    try {
      //ON EXÉCUTE LE CALLBACK
      // 1. On envoie les données à l'API pour enregistrer le contact
      const savedContact = await DB.create(newContactData);
      
      // 2. On transforme la réponse en un véritable objet de notre classe Contact
      const newContactInstance = new Contact(savedContact);
      
      // 3. On l'ajoute à notre liste en mémoire locale
      this.contacts.push(newContactInstance);
      
      // 4. On re-déclenche le render pour mettre à jour le tableau HTML immédiatement 
      this.render();
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact dans l'API :", error);
    }
  }

  updateCount() {
    const countElt = this.domElt.querySelector("#contacts-count");
    if (countElt) {
      // On prend simplement la longueur (length) du tableau de contacts
      countElt.textContent = this.contacts.length;
    }
  }
  render() {
    const targetTbody = this.domElt.querySelector(".contact-list");
    if (targetTbody) {
      targetTbody.innerHTML = "";
    this.contacts.forEach((contact) => contact.render(this.domElt.querySelector(".contact-list")));
    }
    this.updateCount();
  }
}
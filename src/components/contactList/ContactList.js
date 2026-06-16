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
    // On passe le callback (updatedData) à chaque nouveau Contact
    this.contacts = contacts.map((data) => {
      return new Contact(data, 
      (updatedData) => this.updateContactInAPI(updatedData), 
      (idToDelete) => this.deleteContactFromAPI(idToDelete));
    });
    this.render();
  }
  //Methode Add
  async addNewContact(newContactData) {
    try {
      //ON EXÉCUTE LE CALLBACK
      // 1. On envoie les données à l'API pour enregistrer le contact
      const savedContact = await DB.create(newContactData);
      
      // 2. On passe le callback pour les contacts ajoutés manuellement
      const newContactInstance = new Contact(savedContact, 
      (updatedData) => this.updateContactInAPI(updatedData),
      (idToDelete) => this.deleteContactFromAPI(idToDelete));
      
      // 3. On l'ajoute à notre liste en mémoire locale
      this.contacts.push(newContactInstance);
      
      // 4. On re-déclenche le render pour mettre à jour le tableau HTML immédiatement 
      this.render();
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact dans l'API :", error);
    }
  }

  //Methode Modify
  async updateContactInAPI(updatedData) {
    try {
      // 1. On envoie les modifications à l'API en lui passant l'ID et les données
      await DB.update(updatedData.id, updatedData);
      console.log(`Contact ${updatedData.id} mis à jour avec succès sur le serveur !`);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour dans l'API :", error);
    }
  }
  // MÉTHODE DE SUPPRESSION 
  async deleteContactFromAPI(id) {
    try {
      // 1. On demande à la DB de le supprimer sur le serveur MockAPI
      await DB.delete(id);
      
      // 2. On le supprime de notre tableau local en mémoire (this.contacts)
      // On filtre le tableau pour ne garder que les contacts dont l'ID est DIFFÉRENT de celui supprimé
      this.contacts = this.contacts.filter((contact) => contact.id !== id);
      
      // 3. On recalcule le compteur de contacts
      this.updateCount();
      
      console.log(`Contact ${id} supprimé définitivement.`);
    } catch (error) {
      console.error("Erreur lors de la suppression dans l'API :", error);
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
  updateCount() {
    const countElt = this.domElt.querySelector("#contacts-count");
    if (countElt) {
      // On prend simplement la longueur (length) du tableau de contacts
      countElt.textContent = this.contacts.length;
    }
  }
}
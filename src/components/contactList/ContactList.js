import DB from "../../DB";
import Contact from "../contact/Contact";
import getTemplate from "./template";

export default class ContactList {
  constructor(data) {
    this.domElt = document.querySelector(data.el);
    DB.setApiURL(data.apiURL);
    //State pur
    this.contacts = [];
    this.filterValue = "";
    this.sortKey = "firstname";       // Par quoi on trie par défaut
    this.sortDirection = "asc";       // Sens du tri : 'asc' (A->Z) ou 'desc' (Z->A)
    // Init interface
    this.domElt.innerHTML = getTemplate();
    //Écouteurs globaux(Recherche)
    this.initGlobalEvents();
    //Lancement du chargement des données
    this.loadContacts();
  }
  // ACTION 1 : Gérer l'écouteur de la barre de recherche
    initGlobalEvents() {
    const searchInput = this.domElt.querySelector("#search-input"); 
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
        this.filterValue = e.target.value.toLowerCase();
        this.renderSortedAndFilteredContacts(); // On re-render à chaque lettre tapée 
      });
    }
    // 2. Écoute des clics sur les entêtes de colonnes pour le tri
    // On cible les éléments cliquables dans le template (les th dans ce cas)
    const headers = this.domElt.querySelectorAll(".sortable-header"); 
    headers.forEach(header => {
      header.addEventListener("click", () => {
        const key = header.dataset.sort; // ex: "firstname", "lastname", "email"
        
        // Si on clique sur la même colonne, on inverse le sens (A->Z devient Z->A)
        if (this.sortKey === key) {
          this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        } else {
          this.sortKey = key;
          this.sortDirection = "asc"; // Nouvelle colonne = tri normal de A à Z
        }

        this.renderSortedAndFilteredContacts(); // On rafraîchit l'affichage avec le nouveau tri 
      });
    });
  }

  //  ZONE 1 : RESPONSABILITÉ LOGIQUE ET STATE (MÉTIER)
  //------------------------------------------------------
    // Action 1 = instancier un composant Contact
  createContactInstance(rawData) {
    return new Contact(
      rawData, 
      (updatedData) => this.updateContactInAPI(updatedData),
      (idToDelete) => this.deleteContactFromAPI(idToDelete)
    );
  }
  // Action 2 = transformer un tableau de données brutes en instances
  initContactsArray(dataArray) {
    this.contacts = dataArray.map(data => this.createContactInstance(data));
  }
  // Action 3 = extraire les données pures sans pollution DOM/méthodes
  getRawData() {
    return this.contacts.map(contact => ({
      id: contact.id,
      firstname: contact.firstname,
      lastname: contact.lastname,
      email: contact.email
    }));
  }
  // L'ORCHESTRATEUR UNIQUE DU STATE : Dès que la mémoire change, on passe par ici
  commitState() {
    // Action A : Mettre à jour la persistance (uniquement avec des données pures)
    const rawData = this.getRawData();
    localStorage.setItem("contacts_cache", JSON.stringify(rawData));

    // Action B : Mettre à jour l'UI globale
    this.renderSortedAndFilteredContacts();
  }
  //  ZONE 2 : RESPONSABILITÉ API (PERSISTANCE DISTANTE)
  //--------------------------------------------------------------
  // ACTION 1 : Orchestrer le chargement des données (Sécurité API / Cache)
  async loadContacts() {
    try {
      const contactsData = await DB.findAll();
      this.initContactsArray(contactsData);
      this.commitState(); // On enregistre le cache frais et on affiche
    } catch (error) {
      console.warn("API Down. Récupération du cache localStorage...");
      this.loadFromLocalStorage();
    }
    this.renderSortedAndFilteredContacts();
  }
  
  // ACTION 2 : Lire depuis le localStorage en cas de panne
  loadFromLocalStorage() {
    const cachedData = localStorage.getItem("contacts_cache");
    if (cachedData) {
      this.initContactsArray(JSON.parse(cachedData));
    }
    this.renderSortedAndFilteredContacts();
  }
  //Methode Add
  async addNewContact(newContactData) {
    try {
      //ON EXÉCUTE LE CALLBACK
      // 1. On envoie les données à l'API pour enregistrer le contact
      const savedContact = await DB.create(newContactData);
      // 2. On passe le callback pour les contacts ajoutés manuellement
      const newInstance = this.createContactInstance(savedContact);
      // 3. On l'ajoute à notre liste en mémoire locale
      this.contacts.push(newInstance);
      // Mise à jour localStorage
      this.commitState();
    } catch (error) {
      console.error("Erreur lors de l'ajout du contact dans l'API :", error);
    }
  }

  //Methode Modify
  async updateContactInAPI(updatedData) {
    try {
      await DB.update(updatedData.id, updatedData);
      
      // On met à jour explicitement notre state local en mémoire
      const target = this.contacts.find(c => c.id === updatedData.id);
      if (target) {
        target.firstname = updatedData.firstname;
        target.lastname = updatedData.lastname;
        target.email = updatedData.email;
      }
      
      // On synchronise le localStorage et on rafraîchit l'écran
      this.commitState();
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
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

      // Mise à jour localStorage
      this.commitState();
      
      console.log(`Contact ${id} supprimé définitivement.`);
    } catch (error) {
      console.error("Erreur lors de la suppression dans l'API :", error);
    }
  }

  //  ZONE 3 : RESPONSABILITÉ RENDU / DOM / FILTRAGE
  //-------------------------------------------------------
  // ACTION 1 : Filtrer par plusieurs mots
  getFilteredContacts() {
    // Si la recherche est vide, on retourne tous les contacts
    if (!this.filterValue.trim()) return this.contacts;

    // On découpe la recherche en un tableau de mots (ex: "john do" -> ["john", "do"])
    // filter(Boolean) permet d'éviter les bugs si l'utilisateur tape plusieurs espaces d'affilée
    const searchWords = this.filterValue.split(" ").filter(Boolean);

    return this.contacts.filter(contact => {
      // Pour chaque contact, on vérifie si TOUS les mots saisis correspondent
      return searchWords.every(word => {
        return contact.firstname.toLowerCase().includes(word) || 
               contact.lastname.toLowerCase().includes(word) ||
               contact.email.toLowerCase().includes(word);
      });
    });
  }
  // Trier les contacts filtrés
  getSortedAndFilteredContacts() {
    // On récupère d'abord les contacts qui correspondent à la recherche
    const filtered = this.getFilteredContacts();

    // On applique le tri de manière immuable (avec [...array] pour ne pas détruire l'ordre d'origine de l'état)
    return [...filtered].sort((a, b) => {
      // On récupère la valeur textuelle de la colonne (ex: a['firstname'])
      const valueA = a[this.sortKey].toLowerCase();
      const valueB = b[this.sortKey].toLowerCase();

      // Comparaison alphabétique standard en JavaScript
      if (valueA < valueB) return this.sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }
  // ACTION 2 : Mettre à jour l'interface (L'ancienne méthode render() renommée)
  renderSortedAndFilteredContacts() {
    const targetTbody = this.domElt.querySelector(".contact-list");
    if (!targetTbody) return; 
    targetTbody.innerHTML = ""; // Sécurisé
    // Récupération de la donnée exacte triée et filtrée
    const dataToRender = this.getSortedAndFilteredContacts();
    
    // Rendu graphique pur
    dataToRender.forEach((contact) => contact.render(targetTbody));
    
    // Mise à jour du compteur basé sur la même donnée exacte
    this.updateCount(dataToRender.length);
  }
  // ACTION 3 : Mettre à jour le compteur
  updateCount(total) {
    const countElt = this.domElt.querySelector("#contacts-count");
    if (countElt) {
      // On prend simplement la longueur (length) du tableau de contacts
      countElt.textContent = total;
    }
  }
}
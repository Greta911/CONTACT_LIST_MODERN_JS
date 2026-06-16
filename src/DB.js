export default class DB {
  static setApiURL(data) {
    this.apiURL = data;
  }

  //CRUD
  //READ: afficher les contacts
  static async findAll() {
    const response = await fetch(this.apiURL + "contacts");
    return response.json();
  }
  //CRÉER UN CONTACT
  static async create(data) {
    const response = await fetch(this.apiURL + "contacts", {
      method: "POST", // On indique qu'on veut CRÉER une ressource
      headers: {
        "Content-Type": "application/json", // On précise qu'on envoie du JSON
      },
      body: JSON.stringify(data), // On transforme l'objet JavaScript en texte JSON
    });

    // MockAPI nous renvoie le contact créé avec son ID généré par la base de données
    return response.json();
  }
  //MODIFIER UN CONTACT
  static async update(id, data) {
    // On ajoute l'id dans l'URL pour cibler le bon contact (ex: .../contacts/5)
    const response = await fetch(`${this.apiURL}contacts/${id}`, {
      method: "PUT", // PUT est la méthode HTTP standard pour modifier une ressource
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // On envoie les nouvelles données
    });
    return response.json();
  }
  //SUPPRIMER UN CONTACT
  static async delete(id) {
    const response = await fetch(`${this.apiURL}contacts/${id}`, {
      method: "DELETE", // On indique au serveur qu'on veut SUPPRIMER
    });
    return response.json();
  }
}

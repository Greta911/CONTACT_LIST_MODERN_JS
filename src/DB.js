export default class DB {
  static setApiURL(data) {
    this.apiURL = data;
  }

  static async findAll() {
    const response = await fetch(this.apiURL + "contacts");
    return response.json();
  }
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
}

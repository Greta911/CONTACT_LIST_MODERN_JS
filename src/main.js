
import ContactList from "./components/contactList/ContactList";
import ContactForm from "./components/contactForm/ContactForm";



const contactListApp = new ContactList({
  el: "#app",
  apiURL: "https://6a2fdceba7f8866418d53067.mockapi.io/"
});

// On crée le formulaire et, on lui donne une fonction pour ajouter un contact dans la liste: CALLBACK
new ContactForm("#form-section", (newContactData) => {
  // Cette fonction sera exécutée par le formulaire lors du submit 
  contactListApp.addNewContact(newContactData); 
});


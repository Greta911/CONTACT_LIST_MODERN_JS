import "./styles.css";

export default function getTemplate(contact) {
  return `
  <td class="p-4">
                <span class="${contact.isEditing ? "hidden" : ""}">${contact.firstname}</span>
                <input
                  type="text"
                  class="input-firstname ${!contact.isEditing ? "hidden" : ""} mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value="${contact.firstname}"
                />
              </td>
    
    <td class="p-4">
                <span class="${contact.isEditing ? "hidden" : ""}">${contact.lastname}</span>
                <input
                  type="text"
                  class="input-lastname ${!contact.isEditing ? "hidden" : ""} mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value="${contact.lastname}"
                />
              </td>          
    <td class="p-4">
                <span class="${contact.isEditing ? "hidden" : ""}">${contact.email}</span>
                <input
                  type="text"
                  class="input-email ${!contact.isEditing ? "hidden" : ""} mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value="${contact.email}"
                />
              </td> 
    <td class="p-4">
                <div class="flex justify-end space-x-2">
                  <button
                    class="btn-check ${!contact.isEditing ? "hidden" : ""} bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
                  >
                    <i class="fa-solid fa-check"></i>
                  </button>
                  <button
                    class="btn-edit ${contact.isEditing ? "hidden" : ""} bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn-delete ${contact.isEditing ? "hidden" : ""} bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
              `;
}

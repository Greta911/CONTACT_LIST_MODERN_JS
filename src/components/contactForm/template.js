import "./styles.css";

export default function getTemplate() {
  return `
  <!-- Aside gauche pour le formulaire -->
    <form id="form-add-contact" class="w-full flex-1 h-full bg-gray-200 p-6 pb-12">
      <h2 class="text-xl font-bold mb-4">Add a Contact</h2>
      <div class="mb-4">
        <label class="block text-gray-700">Firstname</label>
        <input
          type="text"
          id="input-firstname"
          class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Alex"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Lastname</label>
        <input
          type="text"
          id="input-lastname"
          class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Doe"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input
          type="email"
          id="input-email"
          class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="alex.doe@gmail.com"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Add
      </button>
    </form>`
}
import "./styles.css";

export default function getTemplate() {
  return `
  <div id="form-section" class="w-1/3 bg-gray-200 self-stretch flex flex-col"></div>
    <!-- Section droite pour la liste des contacts -->
    <section class="w-2/3 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold mb-4">Contacts List</h2>
          <p class="text-gray-600 mb-4">
            Contacts Count : <span id="contacts-count" class="font-bold"></span>
          </p>
        </div>

        <!-- Filtre de recherche -->
        <div class="mb-4">
          <input
            id="search-input"
            type="text"
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search a contact"
          />
        </div>

        <!-- Liste des contacts triée et filtrée -->
        <table class="table-auto w-full contacts-table">
          <thead>
            <tr class="bg-gray-200">
              <th class="sortable-header text-left p-4 rounded-tl-lg cursor-pointer hover:text-indigo-600" data-sort="firstname">
                <a href="#">Firstname</a>
              </th>
              <th class="sortable-header text-left p-4 cursor-pointer hover:text-indigo-600" data-sort="lastname"><a href="#">Lastname</a></th>
              <th class="sortable-header text-left p-4 cursor-pointer hover:text-indigo-600" data-sort="email">
                <a href="#">Email</a>
              </th>
              <th class="text-right p-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          <tbody class="contact-list"></tbody>
        </table>
      </section>
    `;
}
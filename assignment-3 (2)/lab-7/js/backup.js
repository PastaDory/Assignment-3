// async function appInit(){
//     const res = await fetch('https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/albums');
//     const payload = await res.json();
//     console.log(payload);
// }

// document.addEventListener("DOMContentLoaded", function() {
//     const searchButton = document.getElementById("search-button");
//     const favoritesButton = document.getElementById("favorites-button");
//     const searchTab = document.getElementById("search-tab");
//     const favoritesTab = document.getElementById("favorites-tab");
    
//     // Event listener for Search button
//     searchButton.addEventListener("click", function() {
//         // Add active class to search button and remove it from favorites button
//         searchButton.classList.add("active");
//         favoritesButton.classList.remove("active");
        
//         // Remove d-none class from search tab and add it to favorites tab
//         searchTab.classList.remove("d-none");
//         favoritesTab.classList.add("d-none");
//     });
    
//     // Event listener for Favorites button
//     favoritesButton.addEventListener("click", function() {
//         // Add active class to favorites button and remove it from search button
//         favoritesButton.classList.add("active");
//         searchButton.classList.remove("active");
        
//         // Remove d-none class from favorites tab and add it to search tab
//         favoritesTab.classList.remove("d-none");
//         searchTab.classList.add("d-none");
//     });
// });

async function searchAlbums(query) {
    try {
        const res = await fetch(`https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/albums`);
        if (!res.ok) {
            throw new Error('Failed to fetch search results');
        }
        const data = await res.json();
        
        // Filter albums matching the query on artistName or albumName
        const filteredAlbums = data.filter(album =>
            album.artistName.toLowerCase().includes(query.toLowerCase()) ||
            album.albumName.toLowerCase().includes(query.toLowerCase())
        );

        return filteredAlbums;
    } catch (error) {
        console.error('Error searching albums:', error.message);
        return []; // Return an empty array if there's an error
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-button");
    const favoritesButton = document.getElementById("favorites-button");
    const searchTab = document.getElementById("search-tab");
    const favoritesTab = document.getElementById("favorites-tab");
    const searchForm = document.getElementById("search-form");
    const searchResults = document.getElementById("search-results");

    // Event listener for Search button
    searchButton.addEventListener("click", function() {
        // Add active class to search button and remove it from favorites button
        searchButton.classList.add("active");
        favoritesButton.classList.remove("active");

        // Remove d-none class from search tab and add it to favorites tab
        searchTab.classList.remove("d-none");
        favoritesTab.classList.add("d-none");
    });

    // Event listener for Favorites button
    favoritesButton.addEventListener("click", function() {
        // Add active class to favorites button and remove it from search button
        favoritesButton.classList.add("active");
        searchButton.classList.remove("active");

        // Remove d-none class from favorites tab and add it to search tab
        favoritesTab.classList.remove("d-none");
        searchTab.classList.add("d-none");
    });

    // Event listener for search form submission
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent form submission

        // Get search query
        const query = document.getElementById("query").value.trim();

        // Fetch albums matching the search query from the API
        const searchResultsData = await searchAlbums(query);

        // Clear previous search results
        searchResults.innerHTML = "";

        // Render search results using the provided HTML template
        searchResultsData.forEach(album => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
            listItem.innerHTML = `
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${album.albumName} <span class="badge bg-primary rounded-pill">${album.averageRating}</span></div>
                    <span>${album.artistName}</span>
                </div>
                <button data-uid="${album.uid}" type="button" class="btn btn-success">Add to Favorites</button>
            `;
            searchResults.appendChild(listItem);
        });
    });
});





//another approach
// fetch('https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/albums')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     // Log the data to the console
//     console.log(data);

//     // Alternatively, you can loop through the data and log each item
//     // data.forEach(item => console.log(item));
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });
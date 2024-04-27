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

// Define a variable to store favorite albums
let favoriteAlbums = [];

// Function to add an album to favorites
function addToFavorites(album) {
    favoriteAlbums.push(album);
}

// Function to remove an album from favorites
function removeFromFavorites(album) {
    favoriteAlbums = favoriteAlbums.filter(favAlbum => favAlbum.uid !== album.uid);
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

        // Render favorite albums
        renderFavoriteAlbums();
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
            const listItem = createAlbumListItem(album, true); // Pass true to indicate it's a search result
            searchResults.appendChild(listItem);

            // Event listener for add to favorites button
            const addToFavoritesButton = listItem.querySelector('.add-to-favorites');
            addToFavoritesButton.addEventListener('click', function() {
                const albumUID = this.getAttribute('data-uid');
                const selectedAlbum = searchResultsData.find(album => album.uid === albumUID);
                
                // Check if the album is not already in favorites
                if (!isAlbumInFavorites(selectedAlbum)) {
                    addToFavorites(selectedAlbum);
                    addAlbumToFavoritesAPI(selectedAlbum); // Add album to API favorites
                    renderFavoriteAlbums(); // Re-render favorites after addition
                }
            });
        });
    });

    // Function to render favorite albums
    function renderFavoriteAlbums() {
        const favoritesList = document.getElementById('my-albums');
        favoritesList.innerHTML = '';

        favoriteAlbums.forEach(album => {
            const listItem = createAlbumListItem(album, false); // Pass false to indicate it's a favorite album
            favoritesList.appendChild(listItem);

            // Event listener for remove from favorites button
            const removeFromFavoritesButton = listItem.querySelector('.remove-from-favorites');
            removeFromFavoritesButton.addEventListener('click', function() {
                const albumUID = this.getAttribute('data-uid');
                const selectedAlbum = favoriteAlbums.find(album => album.uid === albumUID);
                removeFromFavorites(selectedAlbum);
                removeAlbumFromFavoritesAPI(selectedAlbum); // Remove album from API favorites
                renderFavoriteAlbums(); // Re-render favorites after removal
            });
        });
    }

    // Function to check if an album is already in favorites
    function isAlbumInFavorites(album) {
        return favoriteAlbums.some(favAlbum => favAlbum.uid === album.uid);
    }

    // Function to add an album to favorites API
    async function addAlbumToFavoritesAPI(album) {
        try {
            const response = await fetch('https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(album)
            });
            if (!response.ok) {
                throw new Error('Failed to add album to favorites API');
            }
        } catch (error) {
            console.error('Error adding album to favorites API:', error.message);
        }
    }

    // Function to remove an album from favorites API
    async function removeAlbumFromFavoritesAPI(album) {
        try {
            const response = await fetch(`https://661c3bf7e7b95ad7fa69fc64.mockapi.io/api/v1/favorites/${album.uid}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to remove album from favorites API');
            }
        } catch (error) {
            console.error('Error removing album from favorites API:', error.message);
        }
    }

    // Function to create an album list item
    function createAlbumListItem(album, isSearchResult) {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        listItem.innerHTML = `
            <div class="ms-2 me-auto">
                <div class="fw-bold">${album.albumName} <span class="badge bg-primary rounded-pill">${album.averageRating}</span></div>
                <span>${album.artistName}</span>
            </div>
            <button data-uid="${album.uid}" type="button" class="btn ${isSearchResult ? 'btn-success add-to-favorites' : 'btn-danger remove-from-favorites'}">${isSearchResult ? 'Add to Favorites' : 'Remove from Favorites'}</button>
        `;
        return listItem;
    }
});


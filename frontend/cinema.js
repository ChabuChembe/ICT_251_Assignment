// frontend/cinema.js
document.addEventListener('DOMContentLoaded', fetchAndRenderMovies);

const apiUrl = 'http://localhost:3000/api/movies';
const postersContainer = document.getElementById('posters-container');
const showtimesTbody = document.getElementById('showtimes-tbody');

// Function to fetch data and update both sections
async function fetchAndRenderMovies() {
    try {
        const response = await fetch(apiUrl);
        const movies = await response.json();

        // Clear existing content
        postersContainer.innerHTML = '';
        showtimesTbody.innerHTML = '';

        movies.forEach(movie => {
            // --- 1. Render Posters ---
            const posterItem = document.createElement('li');
            posterItem.innerHTML = `
                <div class="poster-container" title="${movie.movie_title}">
                    <img src="${movie.poster_url}" alt="${movie.movie_title} Poster">
                </div>
            `;
            postersContainer.appendChild(posterItem);

            // --- 2. Render Showtimes Table ---
            const showtimeRow = document.createElement('tr');
            showtimeRow.innerHTML = `
                <td>${movie.movie_title}</td>
                <td>${movie.start_time}</td>
                <td>${movie.hall}</td>
            `;
            showtimesTbody.appendChild(showtimeRow);
        });

    } catch (error) {
        console.error('Error fetching movie data:', error);
        // Display a user-friendly error message on the page if the API is down
        showtimesTbody.innerHTML = '<tr><td colspan="3">Cannot load showtimes. Please try again later.</td></tr>';
    }
}
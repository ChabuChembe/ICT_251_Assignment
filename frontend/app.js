// frontend/app.js
document.addEventListener('DOMContentLoaded', () => {

    const apiUrl = 'http://localhost:3000/api/movies';
    const movieForm = document.getElementById('movie-form');
    const movieIdInput = document.getElementById('movie-id');
    const movieTitleInput = document.getElementById('movie-title');
    const startTimeInput = document.getElementById('start-time');
    const hallInput = document.getElementById('hall');
    const posterUrlInput = document.getElementById('poster-url');
    const descriptionInput = document.getElementById('description');
    const moviesTbody = document.getElementById('movies-tbody');

    // --- (R) Read: Fetch and display all movies ---
    async function fetchMovies() {
        try {
            const response = await fetch(apiUrl);
            const movies = await response.json();

            moviesTbody.innerHTML = ''; // Clear existing table rows
            movies.forEach(movie => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${movie.movie_title}</td>
                    <td>${movie.start_time}</td>
                    <td>${movie.hall}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${movie.id}">Edit</button>
                        <button class="delete-btn" data-id="${movie.id}">Delete</button>
                    </td>
                `;
                moviesTbody.appendChild(tr);
            });
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    }

    // --- (C) Create & (U) Update: Handle form submission ---
    movieForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = movieIdInput.value;
        const movieData = {
            movie_title: movieTitleInput.value,
            start_time: startTimeInput.value,
            hall: hallInput.value,
            poster_url: posterUrlInput.value,
            description: descriptionInput.value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        try {
            await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData),
            });

            // Reset form and refresh list
            movieForm.reset();
            movieIdInput.value = ''; // Clear hidden ID
            fetchMovies();

        } catch (err) {
            console.error('Error saving movie:', err);
        }
    });

    // --- Handle Edit & Delete button clicks ---
    moviesTbody.addEventListener('click', async (e) => {
        const target = e.target;

        // (U) Edit: Load values into form
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            
            // Fetch the single movie's data to populate the form
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                const movie = await response.json();
                
                movieIdInput.value = movie.id;
                movieTitleInput.value = movie.movie_title;
                startTimeInput.value = movie.start_time;
                hallInput.value = movie.hall;
                posterUrlInput.value = movie.poster_url;
                descriptionInput.value = movie.description;

                window.scrollTo(0, 0); // Scroll to top to see the form
            } catch (err) {
                console.error('Error fetching movie for edit:', err);
            }
        }

        // (D) Delete: Remove a record
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            
            if (confirm('Are you sure you want to delete this movie?')) {
                try {
                    await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                    });
                    fetchMovies(); // Refresh list
                } catch (err) {
                    console.error('Error deleting movie:', err);
                }
            }
        }
    });

    // Initial fetch of movies on page load
    fetchMovies();
});
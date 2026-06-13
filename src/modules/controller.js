export const getResults = async function(name) {
    try {
        const response = await fetch(`http://localhost:4000/movie/search/${name}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.log('Error fetching data: ', error);
        return null;
    }
}

export const getMovie = async function(movieId) {
    try {
        const response = await fetch(`http://localhost:4000/movie/${movieId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        console.log('Error fetching data: ', error);
        return null;
    }
}

export const ifExist = async function(movieId) {
    try {
        const response = await fetch(`http://localhost:4000/storage/movie/${movieId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        console.log('Error fetching data: ', error);
        return null;
    }
}

export const getSignedURL = async function(movieId) {
    try {
        const response = await fetch(`http://localhost:4000/storage/get/${movieId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        console.log('Error fetching data: ', error);
        return null;
    }
}

export const getOwnedMovies = async function() {
    try {
        const response = await fetch('http://localhost:4000/storage/get/movies');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.log('Error fetching data: ', error);
        return null;
    }
}

export const getListedMovies = async function(ids) {
    try {
        const format = { ids }

        const response = await fetch('http://localhost:4000/movie/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(format)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching data: ', error);
        return [];
    }
}

export const wishlistRequest = function(movie) {
    const webhookURL = 'https://discord.com/api/webhooks/1398501217096826971/wGb54t_4DA99rYCwP5Yr0pXaXdqgnObit54SobYpLf_qdcBpYoZsENJkIdAD8-Z_wlBY'

    const data = {
        "content": null,
        "embeds": [{
            "title": "Movie Requested",
            "description": "A user has requested a movie to be added.",
            "color": 5814783,
            "fields": [{
                "name": "Movie",
            "value": `Movie Name: ${movie.title}\nMovie ID: ${movie.id}`
        }]
    }],
    "username": "NovaStream",
    "avatar_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pKfmaZiPLOBw5KL9oz6bb7WL68v-QFuHvg&s",
    "attachments": []
    }

    fetch (webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}
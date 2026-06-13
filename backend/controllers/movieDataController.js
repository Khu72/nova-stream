const apiKey = '1cb6e3fac5cbdd8a16202544d08c1c8a';

export const getResults = async (req, res) => {
    const name = req.params.name;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(name)}&include_adult=false`)
        .then(res => res.json())
        .then(data => {
            const results = data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://i.imgur.com/hAqQF3N.png'
            }))
            return res.status(200).json({ data: results })
        })
    return res.status(400);
}

const getWallpaper = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`);

        if (response.ok) {
            const data = await response.json();
            const sorted = data.backdrops?.sort((a, b) => b.width - a.width);
            const largest = sorted?.[0];

            return largest
                ? `https://image.tmdb.org/t/p/original${largest.file_path}`
                : 'https://static.vecteezy.com/system/resources/previews/043/555/242/non_2x/realistic-3d-cinema-film-strip-in-perspective-isolated-on-blue-background-template-cinema-festival-movie-design-cinema-film-strip-for-ad-poster-presentation-show-brochure-banner-or-flyer-vector.jpg'
        } else {
            console.warn("TMDb request failed with status", response.status);
        } 
    } catch (error) {
        console.error("Failed to fetch backdrop:", error);
    }

    return 'https://static.vecteezy.com/system/resources/previews/043/555/242/non_2x/realistic-3d-cinema-film-strip-in-perspective-isolated-on-blue-background-template-cinema-festival-movie-design-cinema-film-strip-for-ad-poster-presentation-show-brochure-banner-or-flyer-vector.jpg';
};

export const getMovie = async (req, res) => {
    const id = req.params.id;
    if (!id) { return res.status(400).json({ error: 'Missing id' }) }

    try {
        const wallpaper_url = await getWallpaper(id);

        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
        if (!response.ok) {
            return response.status(400).json({ error: 'Movie not found' })
        }

        const data = await response.json();
        const hours = Math.floor(data.runtime / 60);
        const mins = data.runtime % 60;
        const results = {
            id: data.id,
            title: data.title,
            background_url: wallpaper_url,
            poster_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://i.imgur.com/hAqQF3N.png',
            status: data.status,
            release_date: data.release_date,
            budget: data.budget,
            revenue: data.revenue,
            runtime: `${hours} hour ${mins} minutes`,
            genres: data.genres,
            overview: data.overview
        }
        console.log(data);
        res.status(200).json({ data: results })
    } catch (error) {
        console.error('Error fetching movie: ', error)
        res.status(500).json({ error: 'Internal server error' });
    }

    // try {
    //     fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
    //         .then(res => {
    //             if (!res.ok) {
    //                 return res.status(400).json({ error: 'Movie not found' })
    //             }
    //             return res.json();
    //         })
    //         .then(data => {
    //             const results = {
    //                 id: data.id,
    //                 title: data.title,
    //                 background_url: 'test',
    //                 poster_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg',
    //                 status: data.status,
    //                 release_date: data.release_date,
    //                 budget: data.budget,
    //                 revenue: data.revenue,
    //                 runtime: data.runtime,
    //                 genres: data.genres,
    //                 overview: data.overview
    //             }
    //             console.log(results);
    //             res.status(200).json({ data: results })
    //         })
    // } catch (error) {
    //     console.error('Error fetching movie: ', error)
    //     res.status(500).json({ error: 'Internal server error' });
    // }
}

export const getListedMovies = async (req, res) => {
    try {
        const ids = req.body.ids;

        const results = []

        for (const id of ids) {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
            const data = await response.json();

            results.push({id: data.id, title: data.title, poster_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg'})
        }

        return res.status(200).json({ data: results })
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
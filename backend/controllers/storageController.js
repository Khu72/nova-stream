import admin from '../firebase.js'

const bucket = admin.storage().bucket();

export const checkIfFileExist = async (req, res) => {
    const id = req.params.id;
    const filePath = `movies/${id}.mp4`;
    const file = bucket.file(filePath);

    try {
        const [metadata] = await file.getMetadata();
        // console.log(metadata)
        res.status(200).json({ exists: true });
    } catch (error) {
        if (error.code === 404) {
            res.status(200).json({ exists: false });
        } else {
            console.error('Error checking file:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

export const getOwnedMovies = async (req, res) => {
    try {
        const [files] = await bucket.getFiles({ prefix: 'movies/' });
        const ids = files.map(file => file.name.split('/').pop().replace('.mp4', '')).filter(Boolean);

        const results = []

        for (const id of ids) {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=1cb6e3fac5cbdd8a16202544d08c1c8a`);
            const data = await response.json();

            results.push({id: data.id, title: data.title, poster_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://static.vecteezy.com/system/resources/previews/005/720/408/non_2x/crossed-image-icon-picture-not-available-delete-picture-symbol-free-vector.jpg'})
        }

        return res.status(200).json({ data: results })
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getSignedUrl = async (req, res) => {
    const id = req.params.id;
    const filePath = `movies/${id}.mp4`;
    const file = bucket.file(filePath);

    try {
        const expiresAt = Date.now() + 5 * 60 * 1000;

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: expiresAt
        });

        res.status(200).json({ url })
    } catch (error) {
        console.error('Error checking file:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
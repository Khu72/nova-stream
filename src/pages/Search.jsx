import { useEffect, useState } from 'react';
import { getResults } from '../modules/controller.js'
import { signOut } from 'firebase/auth';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { auth, db } from '../modules/firebase.js';

import Logo from '/logo.png'
import backgroundImage from '/movie-background-collage.jpg'
import { collection, getDocs } from 'firebase/firestore';

function SearchPage() {
    const { query } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [libraryMovies, setLibraryMovies] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const results = await getResults(query);
            const data = results.data;

            const querySnapshot = await getDocs(collection(db, 'movies'));

            const ids = querySnapshot.docs.map(doc => ({id: doc.id, inLibrary: doc.data().inLibrary}));

            setLibraryMovies(data.filter(movie => ids.some(id => id.id == movie.id && id.inLibrary)));
            setMovies(data.filter(movie => !ids.some(id => id.id == movie.id && id.inLibrary)));

            setLoading(false);
        }
        fetch();
    }, [])

    const logout = () => {
        signOut(auth)
        .then(() => {
            navigate('/');
        }).catch((error) => {
            console.error('Logout Error: ', error)
        })
    }
    
    const search = async(e) => {
        navigate(`/search/${name}`)
    }

    const movieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    }

    const home = () => {
        navigate('/home');
    }

    if (loading) return <div className="loader-container"> <div className="loader"></div> </div>;

    return (
        <>
            <div className="h-screen w-screen bg-cover bg-center overflow-auto" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <header className="header">
                    <div className="wrapper m-3">
                        <div className="logo">  
                            <img src={Logo} alt="" onClick={home}/>
                        </div>
                    </div>
                </header>
                <div className='logout-button'>
                    <button onClick={logout}>Logout</button>
                </div>
                <form onSubmit={search}>
                    <div className="search-bar">
                        <input
                                type="text"
                                placeholder='Search for a movie...'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='bg-white text-black'
                            />
                        <button type="submit">🔍</button>
                    </div>
                </form>
                <div className='text-center text-3xl font-serif items-center content-center justify-center m-12 p-8 border border-white/20 rounded-md bg-white/10 backdrop-blur-xs shadow-lg'>
                    <p id='result' className='text-left'>In Library</p>
                    <div id='movie-collection' className='cards-container'>
                        {libraryMovies.map(movie => (
                            <div key={movie.id} className='movie-card' onClick={() => movieClick(movie.id)}>
                                <img src={movie.poster_url} alt="" />
                                <p className='movie-title'>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                    <p id='result' className='text-left'>Results for '{query}'</p>
                    <div id='movie-collection' className='cards-container'>
                        {movies.map(movie => (
                            <div key={movie.id} className='movie-card' onClick={() => movieClick(movie.id)}>
                                <img src={movie.poster_url} alt="" />
                                <p className='movie-title'>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                    {/* <div id='movie-collection' className='cards-container'>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://media.themoviedb.org/t/p/w600_and_h900_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg" alt="" />
                            <p className='movie-title'>Superman</p>
                        </div>
                        <div className='movie-card'>
                            <img src="https://www.themoviedb.org/t/p/w1280/rOuGm07PxBhEsK9TaGPRQVJQm1X.jpg" alt="" />
                            <p className='movie-title'>Pikachu</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default SearchPage
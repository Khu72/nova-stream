import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListedMovies, getOwnedMovies, getResults } from '../modules/controller.js'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from '../modules/firebase.js';

import Logo from '/logo.png'
import backgroundImage from '/movie-background-collage.jpg'
import { doc, getDoc } from 'firebase/firestore';

function HomePage() {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [movies, setMovies] = useState([]);

    const [myList, setMyList] = useState([]);

    const logout = () => {
        signOut(auth)
        .then(() => {
            navigate('/');
        })
        .catch((error) => {
            console.error('Logout Error: ', error)
        })
    }

    const search = async(e) => {
        e.preventDefault();

        navigate(`/search/${name}`);
    }

    const movieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                const fetchAll = async () => {
                    try {
                        const data = await getOwnedMovies();
                        setMovies( data.data );

                        const userRef = doc(db, 'users', firebaseUser.uid);
                        const snap = await getDoc(userRef);

                        if (snap.exists()) {
                            const data = snap.data();
                            if (data.list && data.list.length > 0) {
                                const list = await getListedMovies(data.list);
                                setMyList(list.data);
                            }
                        }
                    } catch (error) {
                        console.error('Error Fetching: ', error);
                    } finally {
                        setLoading(false);
                    }
                }
                fetchAll();
            } else {
                navigate('/')
            }
        })
        return () => unsubscribe();
    }, []);

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
                <div>
                </div>
                <div className='text-center text-3xl font-serif items-center content-center justify-center m-12 p-8 border border-white/20 rounded-md bg-white/10 backdrop-blur-xs shadow-lg'>
                    <p id='result' className='text-left'>In Library</p>
                    <div id='movie-collection' className='cards-container'>
                        {movies.map(movie => (
                            <div key={movie.id} className='movie-card' onClick={() => movieClick(movie.id)}>
                                <img src={movie.poster_url} alt="" />
                                <p className='movie-title'>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                    {myList.length > 0 && (
                        <>
                            <p id='result' className='text-left'>My List</p>
                            <div id='movie-collection' className='cards-container'>
                                {myList.map(movie => (
                                    <div key={movie.id} className='movie-card' onClick={() => movieClick(movie.id)}>
                                        <img src={movie.poster_url} alt="" />
                                        <p className='movie-title'>{movie.title}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePage
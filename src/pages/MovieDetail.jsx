import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovie, ifExist, wishlistRequest } from '../modules/controller.js';
import { addDoc, arrayRemove, arrayUnion, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../modules/firebase.js';

import Logo from '/logo.png'

function MovieDetailPage() {
    const { id } = useParams();

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);
    const [exist, setExist] = useState(false);
    const [genres, setGenres] = useState('');

    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [postingComment, setPostingComment] = useState(false);
    const [commentTextArea, setCommentTextArea] = useState('');
    const [likes, setLikes] = useState('👍 0');
    const [dislikes, setDislikes] = useState('👎 0');

    const [isInList, setIsInList] = useState(false);

    const [name, setName] = useState('');

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                const initiate = async () => {
                    try {
                        // Movie Information
                        const movie = await getMovie(id);
                        setMovie(movie.data);
                        setGenres(movie.data.genres.map(g => g.name).join(', '))

                        const response = await ifExist(id);
                        if (response.exists) {
                            setExist(true);
                        }

                         // Creates the movie data if doesn't exist
                        const movieRef = doc(db, 'movies', String(id));
                        const snap = await getDoc(movieRef);

                        if (!snap.exists()) {
                            await setDoc(movieRef, {
                                title: movie.data.title,
                                likes: 0,
                                dislikes: 0,
                                inLibrary: response.exists
                            });
                        } else {
                            // Fetches data if does exist
                            const data = snap.data();
                            setLikes('👍 ' + data.likes);
                            setDislikes('👎 ' + data.dislikes);

                            setComments(data.comments || [])
                        }

                        // Checks if user has movie added to list
                        const userRef = doc(db, 'users', firebaseUser.uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const list = userSnap.data().list || [];
                            setIsInList(list.includes(id));
                        }
                    } catch (error) {
                        console.log('Error: ', error);
                    } finally {
                        setLoading(false);
                    }
                }
                initiate();
            } else {
                navigate('/');
            }
        })
        return () => unsubscribe();
    }, []);

    const playOrWishlist = () => {
        if (exist) {
            navigate(`/watch/${id}`);
        } else {
            wishlistRequest(movie);
        }
    }

    const likeMovie = async () => {
        const movieRef = doc(db, 'movies', String(id));
        const movieSnap = await getDoc(movieRef);

        if (!movieSnap.exists()) { return; }

        const data = movieSnap.data();
        if (data.likedBy?.includes(user.uid)) { return; }

        let updates = {
            likes: increment(1),
            likedBy: arrayUnion(user.uid)
        };

        if (data.dislikedBy?.includes(user.uid)) {
            updates.dislikes = increment(-1);
            updates.dislikedBy = arrayRemove(user.uid);
            setDislikes(`👎 ${parseInt(dislikes.split(' ')[1]) - 1}`)
        }

        setLikes(`👍 ${parseInt(likes.split(' ')[1]) + 1}`)

        await updateDoc(movieRef, updates);
    }

    const dislikeMovie = async () => {
        const movieRef = doc(db, 'movies', String(id));
        const movieSnap = await getDoc(movieRef);

        if (!movieSnap.exists()) { return; }

        const data = movieSnap.data();
        if (data.dislikedBy?.includes(user.uid)) { return; }

        let updates = {
            dislikes: increment(1),
            dislikedBy: arrayUnion(user.uid)
        };

        if (data.likedBy?.includes(user.uid)) {
            updates.likes = increment(-1);
            updates.likedBy = arrayRemove(user.uid);
            setLikes(`👍 ${parseInt(likes.split(' ')[1]) - 1}`);
        }

        setDislikes(`👎 ${parseInt(dislikes.split(' ')[1]) + 1}`);

        await updateDoc(movieRef, updates);
    }

    const addToList = async () => {
        try {
            const userRef = doc(db, 'users', user.uid);

            await updateDoc(userRef, {
                list: arrayUnion(id)
            });
            setIsInList(true);
        } catch (error) {
            console.error('Error adding to List: ', error);
        }
    }

    const removeFromList = async () => {
        try {
            const userRef = doc(db, 'users', user.uid);

            await updateDoc(userRef, {
                list: arrayRemove(id)
            });
            setIsInList(false);
        } catch (error) {
            console.error('Error removing from List: ', error);
        }
    }

    const postComment = async () => {
        if (commentTextArea.length > 300 || commentTextArea.length < 1) { return; }

        try {
            const movieRef = doc(db, 'movies', id);

            const data = {
                uid: user.uid,
                username: 'test',
                comment: commentTextArea,
                createdAt: new Date().toISOString()
            }

            await updateDoc(movieRef, {
                comments: arrayUnion({
                    uid: user.uid,
                    username: 'test',
                    comment: commentTextArea,
                    createdAt: new Date().toISOString()
                })
            });

            setComments(prevComments => [...prevComments, data]);
        } catch (error) {
            console.error('Error adding comment: ', error)
        } finally {
            setCommentTextArea('');
            setPostingComment(false);
        }
    }

    const deleteComment = async (commentObject) => {
        const movieRef = doc(db, 'movies', id);

        await updateDoc(movieRef, {
            comments: arrayRemove(commentObject)
        });

        setComments(prevComments => prevComments.filter(comment => comment.createdAt !== commentObject.createdAt));
    }

    const convertTime = (time) => {
        const localDate = new Date(time);

        const options = {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };

        const formatted = localDate.toLocaleString(undefined, options);
        return formatted;
    }

    const home = () => {
        navigate('/home');
    }

    if (loading) return <div className="loader-container"> <div className="loader"></div> </div>;

    return (
        <>
            <div className="h-screen w-screen bg-cover bg-center overflow-auto" style={{ backgroundImage: `url(${movie.background_url})` }}>
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
                <div className ='h-3-4 text-center text-3xl font-serif items-center content-center justify-center m-12 p-8 borde border-white/20 rounded-md bg-black/50 backdrop-blur-md shadow-lg h-3/4'>
                    <div className='movie-detail'>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="absolute top-5 right-5 text-white border-2 border-black px-4 py-2 rounded-xl shadow-lg hover:bg-amber-400 transition-all cursor-pointer"
                        >
                        💬 Comments
                        </button>

                        <div className='poster-section'>
                            <img src={movie.poster_url} alt="" />
                            <button onClick={playOrWishlist} className='play-wishlist'>{exist ? "Play" : "Request to be added"}</button>
                            <div className='selections'>
                                <button onClick={likeMovie} className='border-2 border-black rounded-xl m-2 h-15 w-25'>{likes}</button>
                                <button onClick={dislikeMovie} className='border-2 border-black rounded-xl m-2 h-15 w-25'>{dislikes}</button>
                                <button onClick={isInList ? removeFromList : addToList} className='border-2 border-black rounded-xl m-2 size-15'>{isInList ? '-' : '+'}</button>
                            </div>
                        </div>

                        {!showComments ? (
                            <>
                                <div className='movie-info'>
                                    <h2 className="movie-title-detail">{movie.title}</h2>
                                    <p>Release Date: {movie.release_date}</p>
                                    <p>Status: {movie.status}</p>
                                    <p>Runtime: {movie.runtime}</p>
                                    <p>Budget: {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(movie.budget)}</p>
                                    <p>Revenue: {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(movie.revenue)}</p>
                                    <p>Genres: {genres}</p>
                                    <p>Overview: {movie.overview}</p>
                                </div>
                            </>
                        ) : (
                            <div className='comments-box'>
                            <button
                                onClick={() => setPostingComment(!postingComment)}
                                className="w-full top-5 right-5 border-2 border-black px-4 py-2 rounded-xl shadow-lg hover:bg-amber-400 transition-all cursor-pointer"
                            >
                            {postingComment ? 'Show Comments 💬' : 'Post a Comment 💬'}
                            </button>
                            {!postingComment ? (
                                <>
                                    {comments && (
                                        comments.map((comment, index) => (
                                            <div key={index} className="comment-box">
                                                <div className="comment-header">
                                                    <p className="c-user">{comment.username}</p>
                                                    <p className="c-date">{convertTime(comment.createdAt)}</p>
                                                    {comment.uid == user.uid && (<button onClick={() => deleteComment(comment)} className="delete-btn">✖</button>)}
                                                </div>
                                                <div className="comment-body">
                                                    <p>{comment.comment}</p>
                                                </div>
                                            </div>
                                            )
                                        )
                                    )}
                                    {/* {comments.map(comment => {
                                        <div className="comment-box">
                                            <div className="comment-header">
                                                <p className="c-user">BoeReh</p>
                                                <p className="c-date">Aug 24, 2025</p>
                                                {comment.uid == user.uid && (<button className="delete-btn">✖</button>)}
                                            </div>
                                            <div className="comment-body">
                                                <p>This is the comment text. It stays inside the box with padding.</p>
                                            </div>
                                        </div>
                                    })} */}
                                </>
                            ) : (
                                <>
                                    <textarea
                                        placeholder="Write your comment..."
                                        value={commentTextArea}
                                        maxLength={300}
                                        onChange={(e) => setCommentTextArea(e.target.value)}
                                        style={{
                                            margin: '10px 0',
                                            width: '100%',
                                            height: '75%',
                                            padding: '12px',
                                            fontSize: '32px',
                                            borderRadius: '8px',
                                            border: '2px solid #000',
                                            resize: 'vertical'   // allows user to resize vertically
                                        }}
                                    />
                                    <button
                                        onClick={postComment}
                                        className="w-full top-5 right-5 border-2 border-black px-4 py-2 rounded-xl shadow-lg hover:bg-amber-400 transition-all cursor-pointer"
                                    >
                                    Post Comment 💬
                                    </button>
                                </>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetailPage
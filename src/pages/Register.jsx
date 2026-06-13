import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../modules/firebase';
import { doc, getDoc, runTransaction, setDoc } from 'firebase/firestore';

import Logo from '/logo.png'
import backgroundImage from '/movie-background-collage.jpg'


function LoginPage() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const registerHandler = async(e) => {
        e.preventDefault();

        const usernameRef = doc(db, 'usernames', username.toLowerCase());

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    setError('Email already taken.');
                }
                return null;
            })
        
        if (userCredentials) {
            const uid = userCredentials.user.uid;

            try {
                await runTransaction(db, async (transaction) => {
                    const usernameDoc = await transaction.get(usernameRef);

                    if (usernameDoc.exists()) { throw new Error('Username already taken.'); }
                    if (password.length < 7) { throw new Error('Password must be 7 characters long or more.'); }

                    transaction.set(usernameRef, { uid })

                    transaction.set(doc(db, 'users', uid), {
                        username,
                        email,
                        createdAt: new Date(),
                    });
                });
            } catch (error) {
                await userCredentials.user.delete();
                setError(error.message);
            } finally {
                navigate('/home')
            }
        }
    }

    const login = () => {
        navigate('/');
    }

    return (
        <>
            <div className="h-screen w-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <header className="header">
                    <div className="wrapper m-3">
                        <div className="logo">  
                            <img src={Logo} alt="" />
                        </div>
                    </div>
                </header>
                <button onClick={login} className='absolute top-5 right-5 size-16 bg-amber-500 h-10 w-35 font-mono rounded-md hover:cursor-pointer'>Login</button>
                <div className='text-center text-3xl font-serif items-center content-center justify-center m-12 p-8 border border-white/20 rounded-md bg-white/10 backdrop-blur-xs shadow-lg'>
                    <form onSubmit={registerHandler}>
                        <h2 className='m-3'>Register</h2>
                        <h3>Username</h3>
                        <input
                            type="username"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='bg-white text-black'
                            required
                        />
                        <h3>Email</h3>
                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-white text-black'
                            required
                        />
                        <h3>Password</h3>
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-white text-black'
                        />
                        <br />
                        <button type='submit' className='bg-white text-black m-5 size-1/9'>Register</button>
                        {error && <p className='text-red-500'>{error}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginPage
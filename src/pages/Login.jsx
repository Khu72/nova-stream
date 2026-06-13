import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import Logo from '/logo.png'
import backgroundImage from '/movie-background-collage.jpg'


function LoginPage() {
    const auth = getAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = async(e) => {
        e.preventDefault();

        try {
            const userCredential = signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Login Error: ', error.message);
        } finally {
            navigate('/home');
        }
    }

    const register = () => {
        navigate('/register');
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
                <button onClick={register} className='absolute top-5 right-5 size-16 bg-amber-500 h-10 w-35 font-mono rounded-md hover:cursor-pointer'>Register</button>
                <div className='text-center text-3xl font-serif items-center content-center justify-center m-12 p-8 border border-white/20 rounded-md bg-white/10 backdrop-blur-xs shadow-lg'>
                    <form onSubmit={loginHandler}>
                        <h2 className='m-3'>Login</h2>
                        <h3 className='m-3'>Email</h3>
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
                        <button type='submit' className='bg-white text-black m-5 size-1/9'>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginPage
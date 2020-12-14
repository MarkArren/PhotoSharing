import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthConext';
import './Style.scss';

const Login = () => {
    const { login } = useAuth();
    const { loginWithGoogle } = useAuth();
    const emailRef = useRef();
    const passwordRef = useRef();
    const history = useHistory();

    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setloading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            return history.push('/');
        } catch {
            setError('Failed to Log In');
        }
        return setloading(false);
    }

    async function handleGoogleLogin(e) {
        e.preventDefault();

        try {
            setError('');
            setloading(true);
            await loginWithGoogle();
            history.push('/');
        } catch {
            setError('Failed to Log In with Google');
        }
        setloading(false);
    }

    return (
        <div>
            <div className='form-center'>
                <div className='form-wrapper'>
                    <h1>Log In</h1>
                    <br />
                    <div className='error'>{error}</div>
                    <br />
                    <form onSubmit={handleSubmit}>
                        <input type='email' ref={emailRef} placeholder='Email' required />
                        <input type='password' ref={passwordRef} placeholder='Password' required />
                        <input type='submit' disabled={loading} className='submit' value='Log In' />
                    </form>
                    <form onSubmit={handleGoogleLogin}>
                        <input
                            type='submit'
                            disabled={loading}
                            className='submit-google'
                            value='Log In with Google'
                        />
                    </form>
                    <div>
                        <Link to='/password-reset' className='forgot'>
                            Forgot Password?
                        </Link>
                    </div>
                    <br />
                    <div>
                        <span>Don&apos;t have an account?</span>
                        &nbsp;
                        <Link to='/signup'>Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

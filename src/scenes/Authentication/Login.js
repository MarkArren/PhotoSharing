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
            <div className='form-container'>
                <form className='form' onSubmit={handleSubmit}>
                    <span className='form-title'>Log In</span>
                    <div className='form-error'>{error}</div>
                    <input className='form-input' type='email' ref={emailRef} placeholder='Email' required />
                    <input className='form-input' type='password' ref={passwordRef} placeholder='Password' required />
                    <button type='submit' disabled={loading} className='form-input form-submit'>Log In</button>
                    <button type='button' disabled={loading} className='form-input form-submit-google' onClick={handleGoogleLogin}>Log In with Google</button>
                    <Link to='/password-reset' className='forgot'>
                        Forgot Password?
                    </Link>
                    <br />
                    <div>
                        <span>Don&apos;t have an account?&nbsp;</span>
                        <Link to='/signup'>Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

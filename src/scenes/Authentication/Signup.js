import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthConext';
import './Style.scss';

const Signup = () => {
    const { signup } = useAuth();
    const emailRef = useRef();
    const nameRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const history = useHistory();

    const [error, setError] = useState('');
    const [loading, setloading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!emailRef.current.value) {
            return setError('Email is required');
        }
        if (!nameRef.current.value) {
            return setError('Full name is required');
        }
        if (!usernameRef.current.value) {
            return setError('Username is required');
        }

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setloading(true);
            await signup(
                emailRef.current.value,
                passwordRef.current.value,
                usernameRef.current.value,
                nameRef.current.value,
            );
            return history.push('/');
        } catch (exception) {
            if (exception.message) setError(exception.message);
            else setError('Failed to create account');
        }
        return setloading(false);
    }

    return (
        <div>
            <div className='form-container'>
                <form className='form' onSubmit={handleSubmit}>
                    <span className='form-title'>Sign Up</span>
                    <div className='form-error'>{error}</div>
                    <input className='form-input' type='email' ref={emailRef} placeholder='Email' required />
                    <input className='form-input' type='' ref={nameRef} placeholder='Full Name' required />
                    <input className='form-input' type='' ref={usernameRef} placeholder='Username' required />
                    <input className='form-input' type='password' ref={passwordRef} placeholder='Password' required />
                    <input className='form-input' type='password' ref={passwordConfirmRef} placeholder='Password Confirm' required />
                    <button type='submit' disabled={loading} className='form-input form-submit'>Sign Up</button>
                    <div>
                        <span>Already have an account?&nbsp;</span>
                        <Link to='/login'>Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

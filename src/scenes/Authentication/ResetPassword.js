import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthConext';
import './Style.scss';

const ResetPassword = () => {
    const { resetPassword } = useAuth();
    const emailRef = useRef();
    // const history = useHistory();

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setloading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setloading(true);
            await resetPassword(emailRef.current.value);
            setMessage('Please check your email for instructions');
            // history.push("/login")
        } catch {
            setError('Failed to reset password');
        }
        setloading(false);
    }

    return (
        <div>
            <div className='form-container'>
                <form className='form' onSubmit={handleSubmit}>
                    <span className='form-title'>Password Reset</span>
                    <div className='error green'>{message}</div>
                    <div className='error'>{error}</div>
                    <input className='form-input' type='email' ref={emailRef} placeholder='Email' required />
                    <button type='submit' disabled={loading} className='form-input form-submit'>Reset Password</button>
                    <div>
                        <span>Don&apos;t have an account?&nbsp;</span>
                        <Link to='/signup'>Sign Up</Link>
                    </div>
                    <br />
                    <div>
                        <span>Already have an account?&nbsp;</span>
                        <Link to='/login'>Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

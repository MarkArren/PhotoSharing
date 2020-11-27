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
            <div className='form-center'>
                <div className='form-wrapper'>
                    <h1>Password Reset</h1>
                    <br />
                    <div className='error green'>{message}</div>
                    <br />
                    <div className='error'>{error}</div>
                    <br />
                    <form onSubmit={handleSubmit}>
                        <input type='email' ref={emailRef} placeholder='Email' required />
                        <input
                            type='submit'
                            disabled={loading}
                            className='submit'
                            value='Reset Password'
                        />
                    </form>
                    <div>
                        <span>Don&apos;t have an account?</span>
                        <Link to='/signup'>Sign Up</Link>
                    </div>
                    <br />
                    <div>
                        <span>Already have an account?</span>
                        <Link to='/login'>Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

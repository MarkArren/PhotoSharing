import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthConext';
import { Link, useHistory } from "react-router-dom";
import './Style.scss'

const Signup = () => {
    const { signup } = useAuth()
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const history = useHistory()

    const [error, setError] = useState("");
    const [loading, setloading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setloading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            return history.push("/");
        } catch {
            setError("Failed to create account");
        }
        setloading(false);
    }

    return (
        <div>
            <div>

            </div>
            <div className="form-center">
                <div className="form-wrapper"> 
                    <h1>Sign Up</h1><br />
                    <div className="error">{error}</div><br/>
                    <form onSubmit={handleSubmit}>
                        <input type="email" ref={emailRef} placeholder="Email" required />
                        <input type="password" ref={passwordRef} placeholder="Password" required />
                        <input type="password" ref={passwordConfirmRef} placeholder="Password Confirm" required />
                        <input type="submit" disabled={loading} className="submit" value="Sign up" />
                    </form>
                    <div>Already have an account? <Link to="/login">Log In</Link></div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

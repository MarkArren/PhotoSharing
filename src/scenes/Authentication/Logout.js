import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthConext';


const Logout = () => {
    const { logout } = useAuth()

    useEffect(() => {
        // Create an scoped async function in the hook
        async function logoutGoogle() {
            await logout();
        }
        // Execute the created function directly
        logoutGoogle();
      });

    return (
        <div>
            Logging out
        </div>
    );
}

export default Logout;

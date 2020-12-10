import './Navbar.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';

function Navbar() {
    return (
        <IconContext.Provider
            value={{
                color: 'hsl(0,0%, 25%)',
                size: '40px',
                style: { fill: 'hsl(0,0%, 25%)', verticalAlign: 'middle' },
                className: 'global-class-name',
            }}
        >
            <div className='navbar'>
                <Link to='/' className='nav-left'>
                    <h3>ProjectName</h3>
                </Link>
                <div className='nav-right'>
                    <div className='nav-seach nav-icon '>
                        <form className='nav-seach-form '>
                            <input
                                type='text'
                                name='search'
                                placeholder='Search'
                                className='nav-search'
                            />
                        </form>
                    </div>
                    <Link to='/upload' className='nav-profile nav-icon'>
                        <IoAddCircleOutline />
                    </Link>
                    <Link to='/messages' className='nav-messages nav-icon'>
                        <FiMessageCircle />
                    </Link>
                    <div className='nav-notif nav-icon'>
                        <MdNotifications />
                    </div>
                    <Link to='/profile' className='nav-profile nav-icon'>
                        <AiOutlineUser />
                    </Link>
                </div>
            </div>
        </IconContext.Provider>
    );
}

export default Navbar;

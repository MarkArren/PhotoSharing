import './Navbar.scss';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthConext';

function Navbar(props) {
    const { currentUserInfo } = useAuth();
    const { className } = props;
    const [navMobileOpen, setNavMobileOpen] = useState(false);
    const searchRef = useRef();

    function handleSearch(e) {
        e.preventDefault();
        console.log(searchRef.current.value);
        return searchRef.current.value;
    }

    return (
        <div className={`navbar ${className || ''}`}>
            <Link to='/' className='nav-left'>
                <h3>ProjectName</h3>
            </Link>
            <div className='nav-right'>
                <form onSubmit={handleSearch}>
                    <input
                        type='text'
                        ref={searchRef}
                        placeholder='Search'
                        className='nav-search'
                    />
                </form>
                <Link to='/upload' className='nav-icon'>
                    <IoAddCircleOutline />
                </Link>
                <Link to='/messages' className='nav-icon'>
                    <FiMessageCircle />
                </Link>
                <div className='nav-icon'>
                    <MdNotifications />
                </div>
                <Link to={`/${currentUserInfo?.username}`} className='nav-icon'>
                    <AiOutlineUser />
                </Link>
            </div>
            <div className='nav-right-mobile'>
                <div className='nav-icon'>
                    <MdNotifications />
                </div>
                <div className='nav-mobile-toggle nav-icon'>
                    {navMobileOpen ? (
                        <AiOutlineClose
                            onClick={() => {
                                setNavMobileOpen(!navMobileOpen);
                            }}
                        />
                    ) : (
                        <AiOutlineMenu
                            onClick={() => {
                                setNavMobileOpen(!navMobileOpen);
                            }}
                        />
                    )}
                </div>
                <div className={navMobileOpen ? 'nav-mobile' : 'hide'}>
                    <Link to='/'>Home</Link>
                    <Link to='/upload'>Upload</Link>
                    <Link to='/messages'>Messages</Link>
                    <Link to='/profile'>Profile</Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

Navbar.propTypes = {
    className: PropTypes.string,
};

Navbar.defaultProps = {
    className: '',
};

import React, {useEffect, useRef, useState} from 'react';
import { useHistory, Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

import logo from '../../assets/logozenithfullico-transp-122x122-color1.png';
import { useCookies } from 'react-cookie';
import { Dropdown } from 'react-bootstrap';
import { MdPersonOutline } from 'react-icons/md';

const Header = () => {
    const history = useHistory();

    const [getCookie, , removeCookie] = useCookies();
    const [userName, setUserName] = useState('');

    function handleBackButton() {
        history.goBack();
    }

    function logoutFunction() {
        removeCookie('userData');
        removeCookie('token');
        history.push('/');
    }

    return (
        <>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    <Link to="/home" className="navbar-brand cursor-pointer text-small">
                        <img src={logo} alt="logo" className="logo-header-inside"/>
                    </Link>
                    <Dropdown className="ml-2 d-inline ml-auto">
                        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                            <strong className="text-capitalize">{userName}</strong>
                            <MdPersonOutline className="ml-2" size={30} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={logoutFunction}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>
                <div className="position-absolute arrow-left" style={{ left: '0px', top: '80px' }}>
                    <button style={{backgroundColor: "Transparent"}} className="btn" onClick={handleBackButton}>
                        <FiArrowLeft size={20} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Header;
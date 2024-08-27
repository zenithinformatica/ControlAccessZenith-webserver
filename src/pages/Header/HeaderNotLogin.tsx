import React, {useEffect, useState} from 'react';
import { useHistory, Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

import logo from '../../assets/logozenithfullico-transp-122x122.png';
import { useCookies } from 'react-cookie';

const HeaderNotLogin = () => {
    const history = useHistory();
    const [getCookies] = useCookies([]);
    const [getShowBack, setShowBack] = useState<boolean>(true);

    useEffect(() => {
        if(window.location.pathname === "/"){
            setShowBack(false);
        }else{
            setShowBack(true);
        }
        if(getCookies.userData){
            history.push("/home");
        }
    })

    function handleBackButton() {
        history.goBack();
    }

    return (
        <>
            <div className="container-fluid m-0 p-0">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    <Link to="/" className="navbar-brand cursor-pointer text-small">
                        Zenith
                    </Link>
                    <a href="/" className="navbar-brand cursor-pointer ml-auto">
                        <img src={logo} alt="logo" className="logo"/>
                    </a>
                </nav>
                {/* <div className="position-absolute arrow-left" style={{ left: '0px', top: '50px' }}> */}
                {getShowBack
                    ?
                        <>
                            <div className="position-absolute arrow-left" style={{ left: '0px', top: '80px' }}>
                                <button className="btn" onClick={handleBackButton}>
                                    <FiArrowLeft size={20} />
                                </button>
                            </div>
                        </>
                    :
                        <>
                        </>
                
                }
            </div>
        </>
    )
}

export default HeaderNotLogin;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { RiComputerLine, RiBarChart2Line, RiPagesLine } from "react-icons/ri";
import { FaUserAlt } from 'react-icons/fa';
import { IoIosCreate, IoIosBuild } from 'react-icons/io';

import './Home.css';

const Home = () => {
    useEffect(() => {
        document.title = 'Zenith | Home';
    }, []);

    return (
        <>
            <div className="m-5 p-3 card-columns">
                <Link className="text-decoration-none" to="/clients/create">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <IoIosCreate
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>INSERIR CLIENTE</strong>
                        </p>
                    </div>
                </Link>
                <Link className="text-decoration-none" to="/clients">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <IoIosBuild
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>GERENCIAR CLIENTES</strong>
                        </p>
                    </div>
                </Link>
                <Link className="text-decoration-none" to="/users">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <FaUserAlt
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>GERENCIAR USUÁRIOS</strong>
                        </p>
                    </div>
                </Link>
            </div>

            {/* <div className="m-5 p-3 card-columns justify-content-center">
                <Link className="text-decoration-none" to="/microbiology">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <FaMicroscope
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>MICROBIOLOGIA</strong>
                        </p>
                    </div>
                </Link>
                <Link className="text-decoration-none" to="/recomendations">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <FaHospital
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>RECOMENDAÇÕES CCIH</strong>
                        </p>
                    </div>
                </Link>
                <Link className="text-decoration-none" to="/history">
                    <div className="card text-center shadow zoom-hover">
                        <p className="h6">
                            <FaHistory
                                className="mt-3 mb-3 ml-auto mr-auto"
                                size={40}
                            />
                            <br />
                            <strong>HISTÓRICO</strong>
                        </p>
                    </div>
                </Link>
            </div> */}
        </>
    );
}

export default Home;
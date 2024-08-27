import React, { useEffect } from 'react';

import './global.css'
import './App.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import Routes from './routes';

function App() {

    useEffect(() => {
        document.title = 'Zenith | Access Control';
    }, []);

    return (
        <Routes />
    );
}

export default App;

import React, {FormEvent, useEffect, useState} from 'react';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import ToastComponent from '../../components/Toast';
import { useCookies } from 'react-cookie';

const Login = () => {
    const history = useHistory();
    
    const [getUser, setUser] = useState('');
    const [getPassword, setPassword] = useState('');

    const [, setCookies] = useCookies([]);

    const [getLoading, setLoading] = useState<boolean>(false);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        setLoading(true);
        await api.post('/users/login', {username: getUser, password: getPassword}).then(response => {
            if(response.data.userLogin){
                var idUsuario = response.data.userData.IdUsuario;
                var usuario = response.data.userData.Usuario;
                var accessToken = response.data.accessToken;
                var token = response.data.token;
                // setTimeout(() => {
                    setCookiesLogin(idUsuario, usuario, accessToken, token);
                // }, 1000);
            }else{
                showToast("error", "Erro", response.data.error);
            }
        }).catch(err => {
            setLoading(false);
            if (err.response === undefined) {
                showToast("error", "Erro!", err.toString() + ". Faça login e tente novamente")
            } else if(!err.response.data.userLogin && err.response.status === 401) {
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            }else{
                showToast("error", "Erro!", "Status de erro: " + err.response.status);
            }
        })
    }

    async function setCookiesLogin(idUsuario: string, nomeUsuario: string, accessToken: string, token: string){
        let nomeArray = nomeUsuario.split(' ');
        nomeUsuario = nomeArray[0];
        // setCookies('userData', {IdUsuario: idUsuario, Usuario: nomeUsuario, Token: accessToken}, {maxAge: 60});
        // setTimeout(() => {
        setCookies('userData', {IdUsuario: idUsuario, Usuario: nomeUsuario, accessToken: accessToken});
        document.cookie = `token=${token}; path=/; Secure;`
        api.defaults.headers.common['token'] = token;

        history.push('/home');
        setLoading(false);
        // }, 1000);
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    return (
        <>
            <div className="grid justify-center col-12 md:col-6 m-auto">
                <Card title="Login" className="col-12 p-sm-5">
                    <form onSubmit={handleSubmit}>
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="user" value={getUser} onChange={(e) => setUser((e.target as HTMLInputElement).value)} autoFocus/>
                                <label htmlFor="user">Usuário</label>
                            </span>
                        </div>
                        <div className="p-inputgroup my-4">
                            <span className="p-float-label">
                                <Password id="password" value={getPassword} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} feedback={false}/>
                                <label htmlFor="password">Senha</label>
                            </span>
                        </div>
                        <div className="p-justify-end">
                            <Button id = "submit" type="submit" label="Login" loading={getLoading} icon="pi pi-sign-in" />
                        </div>
                        <div className="mt-3">
                            <span>Ainda não possui cadastro?</span><br/>
                            <Link to="/signup">
                                <span className="text-info">Crie já o seu</span>
                            </Link>
                        </div>
                    </form>
                </Card>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                }
            </div>
        </>
    )
}

export default Login;
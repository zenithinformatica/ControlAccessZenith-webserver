import React, {FormEvent, useEffect, useState} from 'react';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import ToastComponent from '../../components/Toast';

const Signup = () => {
    const history = useHistory();
    
    const [getUser, setUser] = useState('');
    const [getPassword, setPassword] = useState('');
    const [getConfirmPassword, setConfirmPassword] = useState('');

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        await api.post('/users', {
            username: getUser,
            password: getPassword,
            confirmPassword: getConfirmPassword
        }).then(response => {
            if (response.data.createdUser){
                showToast("success", "Sucesso", "Cadastro criado com sucesso.");
                setTimeout(() => {
                    history.push("/");
                }, 1000)
            }else{
                showToast("error", "Erro!", response.data.error);
            }
        }).catch(err => {
            if (!err.response.data.createdUser && err.response.status == 401)
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            else if (!err.response.data.createdUser && err.response.status == 409)
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            else
                showToast("error", "Erro!", "Status de erro: " + err.response.status);
        })
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
                <Card title="Cadastro de Usuário" className="col-12 p-sm-5">
                    <form onSubmit={handleSubmit}>
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="user" value={getUser} onChange={(e) => setUser((e.target as HTMLInputElement).value)} autoFocus/>
                                <label htmlFor="user">Usuário</label>
                            </span>
                        </div>
                        <div className="my-4">
                            <span className="p-float-label">
                                <Password id="password" value={getPassword} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} toggleMask 
                                weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte" promptLabel="Digite uma senha"/>
                                <label htmlFor="password">Senha</label>
                            </span>
                        </div>
                        <div className="inputgroup my-4">
                            <span className="p-float-label">
                                <Password id="confirmPassword" value={getConfirmPassword} onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)} toggleMask
                                weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte" promptLabel="Digite uma senha"/>
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                            </span>
                        </div>
                        <div className="p-justify-end">
                            <Button type="submit" label="Cadastrar" icon="pi pi-sign-in" />
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

export default Signup;
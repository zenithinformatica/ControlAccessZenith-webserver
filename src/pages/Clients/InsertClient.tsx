import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Checkbox } from 'primereact/checkbox';

import { useCookies } from 'react-cookie';

import ToastComponent from '../../components/Toast';
import api from '../../services/api';

const InsertClient = () => {
    const history = useHistory();

    const [getIdCliente, setIdCliente] = useState('');
    const [getCnpj, setCnpj] = useState('');
    const [getNome, setNome] = useState('');
    const [getValidade, setValidade] = useState('');
    const [getZenUpdate, setZenUpdate] = useState<boolean|undefined>(false);

    const [getCookies] = useCookies([]);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [getSelectValue, setSelectValue] = useState('CNPJ');
    const options = ['CNPJ', 'CPF'];

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        try {
            api.post("/clients", {IdCliente: getIdCliente, CNPJ: getCnpj, Nome: getNome, Validade: getValidade}, {headers: {accessToken: getCookies.userData.AccessToken}}).then(response => {
                if(response.data.createdClient){
                    showToast("success", "Sucesso", "Cliente criado com sucesso!");
                    setTimeout(() => {
                        history.push("/clients");
                    }, 1500)
                }else{
                    showToast("error", "Erro!", response.data.error);
                }
            }).catch(err => {
                if (err.response === undefined) {
                    showToast("error", "Erro!", err.toString() + ". Faça login e tente novamente")
                }else if(!err.response.data.userLogin && err.response.status === 400){
                    showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
                }else{
                    showToast("error", "Erro!", err.response.data.error + " Status de erro: " + err.response.status);
                }
            })
        } catch (error) {
            return
        }
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
            <div className="p-grid p-justify-center no-select mx-auto col-12 md:col-11">
                <div className="card p-col-12 p-sm-6 p-3">
                    <form onSubmit={handleSubmit}>
                        <h5 className="mb-4">Cadastro de Cliente</h5>
                        <SelectButton className="ml-lg-3 p-mb-4 p-mb-lg-2" value={getSelectValue} options={options} onChange={(e) => {setSelectValue(e.value); setCnpj('')}} />
                        <div className="p-grid p-fluid">
                            <div className="p-col-12 p-lg-4 p-pt-3 p-pt-lg-4">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputText id="idCliente" value={getIdCliente} onChange={(e) => setIdCliente((e.target as HTMLInputElement).value)} />
                                        <label htmlFor="IdCLiente">IdCliente</label>
                                    </span>
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-4 p-py-lg-4 p-pl-lg-4">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                    {getSelectValue === 'CNPJ' 
                                        ?
                                        <>
                                            <InputMask mask="99.999.999/9999-99" id="cnpj" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} />
                                            <label htmlFor="cnpj">CNPJ</label>
                                        </>
                                        :
                                        <>
                                            <InputMask mask="999.999.999-99" id="cpf" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} />
                                            <label htmlFor="cpf">CPF</label>
                                        </>
                                    }
                                    </span>  
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-4 p-pt-3 p-pt-lg-4">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputText id="nome" value={getNome} onChange={(e) => setNome((e.target as HTMLInputElement).value)} />
                                        <label htmlFor="nome">Nome</label>
                                    </span>
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-4 p-pt-3 p-pt-lg-4">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputMask mask="99/99/9999" id="validade" value={getValidade} onChange={(e) => setValidade((e.target as HTMLInputElement).value)} tooltip="DD/MM/YYYY" tooltipOptions={{position: 'bottom'}}/>
                                        <label htmlFor="validade">Validade</label>
                                    </span>
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-12 my-3">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="checkBoxAtualizavel" 
                                            onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} 
                                            checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                    <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                                </div>
                            </div>
                        </div>
                        <Button label="Cadastrar" icon="pi pi-send" iconPos="right" className="ml-lg-3"/>
                        {getToast &&
                            <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                        }
                    </form>
                </div>
            </div>
        </>
    )
};

export default InsertClient;
import React, {useEffect, useState, useRef, FormEvent} from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';

import api from '../../services/api';
import ToastComponent from '../../components/Toast';
import { useCookies } from 'react-cookie';

import './Clients.css';

const Clients = () => {
    const [getClients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState();

    const [getCookies] = useCookies([]);

    const [showDialog1, setShowDialog1] = useState<boolean>();
    const [showDialog2, setshowDialog2] = useState<boolean>();
    const [showDialog3, setshowDialog3] = useState<boolean>(false);
    
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [getUsername, setUsername] = useState<string>();
    const [getValidade, setValidade] = useState<string>();
    const [getCnpj, setCnpj] = useState<string>();
    const [getZenUpdate, setZenUpdate] = useState<boolean|undefined>(false);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        IdCliente: { value: '', matchMode: FilterMatchMode.CONTAINS },
        Nome: { value: '', matchMode: FilterMatchMode.CONTAINS },
        Validade: { value: '', matchMode: FilterMatchMode.CONTAINS },
        CNPJ: { value: '', matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // const [sortField, setSortField] = useState<string>('lastModified');
    // const [sortOrder, setSortOrder] = useState<any>(-1);
    // const [date, setDate] = useState<Date | null>(new Date());

    const ctxmnu = useRef<any>(null);
    const rowsPag = 10;

    const menuModel = [
        {label: 'Atualizar dados cliente', icon: "pi pi-fw pi-user-edit", command: () => {setshowDialog2(true); setUsername(selectedClient.Nome); setCnpj(selectedClient.CNPJ); setZenUpdate(selectedClient.ZenUpdate)}},
        {label: 'Atualizar validade'     , icon: "pi pi-fw pi-pencil"   , command: () => {setShowDialog1(true); setValidade(selectedClient.Validade); setZenUpdate(selectedClient.ZenUpdate)}},
        {label: 'Excluir'                , icon: 'pi pi-fw pi-times'    , command: () => {setshowDialog3(true); setUsername(selectedClient.Nome); }}
    ];

    /*************************************************
     *  Funcao chamada na contrucao do componente
    **************************************************/
    useEffect(() => { 
        fetchData(rowsPag);
    }, []); 

    // const onPage = (event: any) => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         const startIndex = event.first;
    //         const endIndex = event.first + rowsPag;
    //         fetchData(endIndex);
    //         setFirst(startIndex);
    //         setClients(datasource.slice(startIndex, endIndex));
    //         setLoading(false);
    //     })
    // };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Validate Dates in the Format of dd/mm/yyyy
    // https://www.scaler.com/topics/date-validation-in-javascript/
    function isValidDate(sDate: string) {
        let dateformat = /^(0[1-9]|[1-2][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/]\d{4}$/;  // /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])[\/]\d{4}$/;

        // Matching the sDate through regular expression      
        if (sDate?.match(dateformat)) {
            let operator = sDate.split('/');

            // Extract the string into day, month, year
            let datepart: any = [];
            if (operator.length > 1) {
                datepart = sDate.split('/');
            }
            let day = parseInt(datepart[0]);
            let month = parseInt(datepart[1]);
            let year = parseInt(datepart[2]);

            // Create a list of days of a month      
            let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month == 1 || month > 2) {
                if (day > ListofDays[month - 1]) { // To check if the date is out of range 
                    return false;
                }
            } else if (month == 2) {
                let leapYear = false;
                if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
                if ((leapYear == false) && (day >= 29)) {
                    return false;
                }
                else
                    if ((leapYear == true) && (day > 29)) {
                        return false;
                    }
            }
        } else {
            return false;
        }
        return true;
    }

    function isCnpj(CNPJ: string) {
        var cCNPJ = CNPJ?.replace(/[^0-9]/g,"");
        return (cCNPJ?.length == 14) || CNPJ?.includes("/");
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string) {
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 6500)
    }

    /*************************************************
     * Funcao usada para buscar clientes no backend e retornar para datatable
     * Parametros:
     *  endIndex: valor do ultimo registro mostrado na pagina da tabela
    **************************************************/
    async function fetchData(endIndex: number) {
        try {
            if (getCookies.token) {
                await api.get(`/allclients`).then(response => {
                    setLoading(true);
                    if (response.data.showClients) {
                        setTimeout(() => {
                            setClients(response.data.clients);
                            setTotalRecords(response.data.length);
                            setLoading(false);
                        }, 500)
                    }else{
                        showToast("error", "Erro", response.data.error)
                        setLoading(false);
                    }
                }).catch(err => {
                    showToast("error", "Erro", err.response.data.error +  " Status de erro: " + err.response.status)
                    setLoading(false);
                })
            }else{
                showToast("error", "Erro", "Acesso negado.");
            }    

        } catch (error) {
            return;
        }
    }

    /*************************************************
     * Funcao usada para excluir determinado cliente selecionado a partir de IdCliente
    **************************************************/
    async function handleDelete() {       
        try {
            await api.delete(`/clients/${selectedClient?.IdCliente}`, {headers: {accessToken: getCookies.userData.AccessToken}}).then(response => {
                if (response.data.deletedClient) {
                    showToast("success", "Exclusão", "Cliente excluído com sucesso!");
                }else{
                    showToast("error", "Erro!", response.data.error);
                }
                fetchData(getFirst + rowsPag);
                setshowDialog3(false);
            }).catch(err => {
                showToast("error", "Erro", err.response.data.error +  " Status de erro: " + err.response.status)
                setLoading(false);
            })
        } catch (error) {
            setshowDialog3(false);
        }
    }

    async function handleUpdateValiditySubmit(event: FormEvent) {
        event.preventDefault();

        var Validade = getValidade;

        if (Validade === undefined || ! isValidDate(Validade))
            showToast("error", "Erro!", 'Data inválida');
        else{
            try {
                api.put(`/clients/validity/${selectedClient.IdCliente}`, {Validade: Validade, ZenUpdate: getZenUpdate}, {headers: {accessToken: getCookies.userData.AccessToken}}).then(response => {
                    if (response.data.updatedClient) {
                        showToast("success", "Atualização", "Data de validade atualizada com sucesso!");
                        setShowDialog1(false);
                        setValidade('');
                    }else{
                        showToast("error", "Erro!", response.data.error);
                    }
                    fetchData(getFirst + rowsPag);
                }).catch(err => {
                    showToast("error", "Erro", err.response.data.error +  " Status de erro: " + err.response.status)
                    setLoading(false);
                })
            } catch (error) {
                return
            }
        }
    }

    async function handleUpdateSubmit(event: FormEvent) {
        event.preventDefault();
        try {
            api.put(`/clients/${selectedClient.IdCliente}`, {Nome: getUsername, CNPJ: getCnpj, ZenUpdate: getZenUpdate}, {headers: {accessToken: getCookies.userData.AccessToken}}).then(response => {
                if (response.data.updatedClient) {
                    showToast("success", "Atualização", "Dados atualizados com sucesso!");
                    setshowDialog2(false);
                    setUsername('');
                    setCnpj('');
                }else{
                    showToast("error", "Erro!", response.data.error);
                }
                fetchData(getFirst + rowsPag);
            }).catch(err => {
                showToast("error", "Erro", err.response.data.error +  " Status de erro: " + err.response.status)
                setLoading(false);
            })
        } catch (error) {
            return
        }
    }

    /************************
     * Templates
     ************************/
    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
                <Button className="ml-4 p-button-success" icon="pi pi-refresh" onClick={() => fetchData(0)} tooltip="Atualizar Clientes" loading={loading}/>
            </div>          
        );
    };
    const header = renderHeader();

    function showMasked(cCNPJ: string) {
        var cCNPJMasked: string = cCNPJ.replace(/[^0-9]/g,"");                         // CNPJ apenas com numeros;
        if (isCnpj(cCNPJ)) {
            var cCNPJRegEx = cCNPJMasked.match(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/); // "99.999.999/9999-99"
            cCNPJMasked = (cCNPJRegEx?.toString() == null ? "" : cCNPJRegEx[1] + "." + cCNPJRegEx[2] + "." + cCNPJRegEx[3] + "/" + cCNPJRegEx[4] + "-" + cCNPJRegEx[5]);
        } else {
            var cCNPJRegEx = cCNPJMasked.match(/(\d{3})(\d{3})(\d{3})(\d{2})/);        // "999.999.999-99"
            cCNPJMasked = (cCNPJRegEx?.toString() == null ? "" : cCNPJRegEx[1] + "." + cCNPJRegEx[2] + "." + cCNPJRegEx[3] + "-" + cCNPJRegEx[4]);
        }
        return cCNPJMasked;
    }

    const idClienteTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">ID</span>
                <a>{rowData.IdCliente}</a>
            </React.Fragment>
        );
    }

    const nomeTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <p className="p-column-title">Nome</p>
                <a>{rowData.Nome}</a>
            </React.Fragment>
        );
    }

    const validadeTemplate = (rowData: any) => {
        let verifyStatus = rowData.statusValidade;
        let fontColor: any = verifyStatus == true ? "#a80000" : "#106b00";
        let fontBold: any = verifyStatus == true ? "bold" : "bold";

        return (
            <React.Fragment>
                <span className="p-column-title">Validade</span>
                <a style={{ color: fontColor, fontWeight: fontBold }}>{rowData.Validade}</a>
            </React.Fragment>
        );
    }

    const cnpjTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">CNPJ/CPF</span>
                {showMasked(rowData.CNPJ)}
            </React.Fragment>
        );
    }

    const updatedAtTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Última atualização</span>
                {rowData.updated_at}
            </React.Fragment>
        );
    }

    const dtReferenciaTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Dt referência</span>
                <a>{rowData.DtReferencia}</a>
            </React.Fragment>
        );
    }

    const zenUpdateTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">É atualizável?</span>
                <Checkbox checked={rowData.ZenUpdate} readOnly></Checkbox>
                {/* {zenupdate} */}
            </React.Fragment>
        );
    }

    // https://primereact.org/datatable/
    return (
        <>
            <div className="grid block justify-center no-select mx-auto col-12 md:col-11">
                <ContextMenu model={menuModel} ref={ctxmnu}/>
                <div className="datatable-responsive-demo">
                    <DataTable className="p-datatable-responsive-demo datatable-templating-demo"
                        id='clientsTable'
                        dataKey='IdCliente' 
                        value={getClients}
                        paginator={true}
                        rows={rowsPag}
                        header={header}
                        totalRecords={totalRecords}
                        resizableColumns={true}
                        filters={filters}
                        filterDisplay='row'
                        globalFilterFields={['IdCliente', 'Nome', 'Validade', 'CNPJ']}
                        sortOrder={1}
                        removableSort={true}
                        lazy={false}
                        first={getFirst}
                        loading={loading} 
                        contextMenuSelection={selectedClient}
                        onContextMenuSelectionChange={e => setSelectedClient(e.value)}
                        onContextMenu={e => ctxmnu.current.show(e.originalEvent)}>
                        <Column className="" field="IdCliente"    header="ID"                 sortable        body={idClienteTemplate}></Column>
                        <Column className="" field="Nome"         header="Nome"               sortable filter body={nomeTemplate} style={{  }}></Column>
                        <Column className="" field="Validade"     header="Validade"           sortable filter body={validadeTemplate}></Column>
                        <Column className="" field="CNPJ"         header="CNPJ/CPF"           sortable        body={cnpjTemplate}></Column>
                        <Column className="" field="updated_at"   header="Última Atualização" sortable        body={updatedAtTemplate}></Column>
                        <Column className="" field="dtReferencia" header="Dt referência"      sortable        body={dtReferenciaTemplate}></Column>
                        <Column className="" field="zenupdate"    header="Atualizável"        sortable        body={zenUpdateTemplate}></Column>
                    </DataTable>
                </div>
                <Dialog header="Atualizar validade" visible={showDialog1} style={{ width: '50vw' }} onHide={() => setShowDialog1(false)}>
                    <form onSubmit={handleUpdateValiditySubmit}>
                        <div className="p-fluid">
                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                <InputMask className="p-lg-12" mask="99/99/9999" id="validade" value={getValidade} onChange={(e) => setValidade((e.target as HTMLInputElement).value)} required/>
                                <label htmlFor="validade">Validade</label>
                                </span>
                            </div>
                        </div>

                        <div className="p-col-12 p-lg-12 my-3">
                            <div className="flex align-items-center">
                                <Checkbox id="zenupdate" inputId="checkBoxAtualizavel" onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                            </div>
                        </div>

                        <Button label="Atualizar" icon="pi pi-check" className="p-ml-2" iconPos="right"/>
                    </form>
                </Dialog>
                <Dialog header="Atualizar dados" visible={showDialog2} style={{ width: '50vw' }} onHide={() => setshowDialog2(false)}>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="p-fluid">
                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                    <InputText id="nome" value={getUsername} onChange={(e) => setUsername((e.target as HTMLInputElement).value)} required/>
                                    <label htmlFor="nome">Nome</label>
                                </span>
                            </div>

                            <div className="p-col-12 p-lg-12 my-3">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="checkBoxAtualizavel" 
                                            onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} 
                                            checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                    <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                    { isCnpj(getCnpj!)
                                        ?
                                            <>
                                                <InputMask mask="99.999.999/9999-99" id="cnpj" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} required/>
                                                <label htmlFor="cnpj">CNPJ</label>
                                            </>
                                        :
                                            <>
                                                <InputMask mask="999.999.999-99" id="cpf" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} required/>
                                                <label htmlFor="cpf">CPF</label>
                                            </>
                                    }
                                </span>
                            </div>
                        </div>
                        <Button label="Atualizar" icon="pi pi-check" className="p-ml-2" iconPos="right"/>
                    </form>
                </Dialog>
                <Dialog header="Confirmar exclusão" visible={showDialog3} style={{ width: '60vw' }} onHide={() => setshowDialog3(false)}>
                    <p>Deseja exluir o registro {getUsername}?</p>
                    <Button className='p-button-danger' label='Sim' onClick={handleDelete}></Button>
                    <Button className='p-button-success ml-3' label='Nao' onClick={() => setshowDialog3(false)}></Button>
                </Dialog>
            </div>
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent} lifeTime="6000"/>
            }
        </>
    )
}

export default Clients;

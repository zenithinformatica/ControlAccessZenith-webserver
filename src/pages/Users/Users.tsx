import React, {useEffect, useState, useRef} from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';

import api from '../../services/api';
import ToastComponent from '../../components/Toast';
import { useCookies } from 'react-cookie';
import { Button } from 'primereact/button';

import "./Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [datasource] = useState([]);
    const [totalRecords, setTotalRecords] = useState();
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [getCookies] = useCookies([]);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const cm = useRef<any>(null);
    const rows = 10;

    const menuModel = [
        {label: 'Exluir', icon: 'pi pi-fw pi-times', command: () => handleDelete(selectedUser.IdUsuario)}
    ];

    /*************************************************
     * Nome: useEffect
     * Descricao:
     *  Funcao chamada na contrucao do componente
     * Parametros:
     *  Nao possui parametros
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    useEffect(() => {
        getUsers(10);
    }, []);

    const onPage = (event: any) => {
        setLoading(true);
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = event.first + rows;
            getUsers(endIndex);
            setFirst(startIndex);
            setUsers(datasource.slice(startIndex, endIndex));
            setLoading(false);
        })
    }
    
    /*************************************************
     * Nome: getUsers
     * Descricao:
     *  Funcao usada para buscar usuarios no backend e retornar para datatable
     * Parametros:
     *  endIndex: valor do ultimo registro mostrado na pagina da tabela
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    async function getUsers(endIndex: number){
        try {
            if(getCookies.token){
                await api.get(`/users/paginate/${endIndex}`, {headers: {authorization: getCookies.userData.token}}).then(response => {
                    setLoading(true);
                    if(response.data.showUsers){
                        setTimeout(() => {
                            setUsers(response.data.users);
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
            return
        }
    }

    /*************************************************
     * Nome: handleDelete
     * Descricao:
     *  Funcao usada para excluir determinado usuario selecionado
     * Parametros:
     *  userId: Id do usuario a ser excluido
     * Retorno:
     *  Nao possui retorno
    **************************************************/
    async function handleDelete(userId: any){
        try {
            await api.delete(`/users/${userId}/${getCookies.userData.IdUsuario}`, {headers: {accessToken: getCookies.userData.AccessToken}}).then(response => {
                if(response.data.deletedUser){
                    showToast("success", "Exclusão", "Usuário excluído com sucesso!");
                }else{
                    showToast("error", "Erro!", response.data.error);
                }
                getUsers(getFirst + rows);
            }).catch(err => {
                showToast("error", "Erro", err.response.data.error +  " Status de erro: " + err.response.status)
                setLoading(false);
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
    /************************
     * Templates
     ************************/
    const header = (
        <>
            <div className="table-header">
                Usuários
                <Button onClick={() => getUsers(getFirst + rows)} icon="pi pi-refresh" />
            </div>
        </>
    );

    const idUsuarioTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">ID</span>
                <a>{rowData.IdUsuario}</a>
            </React.Fragment>
        );
    }
    const usuarioTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Usuário</span>
                <a>{rowData.Usuario}</a>
            </React.Fragment>
        );
    }
    const ultimoAcessoTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Último Acesso</span>
                {rowData.UltimoAcesso}
            </React.Fragment>
        );
    }

    return (
        <>
            <div className="p-grid p-justify-center no-select mx-auto col-12 md:col-11">
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedUser(null)}/>
                <div className="datatable-responsive-demo p-col-12 p-md-10">
                    <DataTable className="p-datatable-responsive-demo datatable-templating-demo"
                        id="usersId"
                        dataKey="IdUsuario"
                        value={users}
                        paginator={true}
                        rows={rows}
                        header={header}
                        totalRecords={totalRecords}
                        resizableColumns={true}
                        onPage={onPage}
                        lazy={true}
                        first={getFirst}
                        loading={loading}
                        contextMenuSelection={selectedUser}
                        onContextMenuSelectionChange={e => setSelectedUser(e.value)} 
                        onContextMenu={e => cm.current.show(e.originalEvent)}>
                        <Column className="p-col-1" field="IdUsuario" header="ID" body={idUsuarioTemplate}></Column>
                        <Column field="Usuario" header="Usuário" body={usuarioTemplate}></Column>
                        <Column field="UltimoAcesso" header="Último Acesso" body={ultimoAcessoTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            {getToast &&
                <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
            }
        </>
    )
}

export default Users;
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { RecursoService } from '@/service/RecursoService';
import { UsuarioService } from '@/service/UsuarioService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { PermissaoPerfilRecursoService } from '@/service/PermissaoPerfilRecurso';



const PermissaoPerfilRecurso = () => {
    let permissaoPerfilRecursoVazio: Projeto.PermissaoPerfilRecurso = {
        id: 0,
        perfil: {descricao:''},
        recurso: {nome:'',chave:''}
        
    };

    const [permissaoPerfilRecursos, setPermissaoPerfilRecursos] = useState<Projeto.PermissaoPerfilRecurso[] | null>(null);
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursosDialog, setDeletePermissaoPerfilRecursosDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissaoPerfilRecurso, setSelectedPermissaoPerfilRecurso] = useState<Projeto.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []);
    const recursoService = useMemo(() => new RecursoService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [perfis, setPerfis] = useState<Projeto.Perfil[] | null>(null);
    const [recursos, setRecursos] = useState<Projeto.Recurso[] | null>(null);

    useEffect(() => {
        if (!permissaoPerfilRecurso) {
            permissaoPerfilRecursoService.listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPermissaoPerfilRecursos(response.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [permissaoPerfilRecursoService, permissaoPerfilRecurso]);

    useEffect(() => {
        if(permissaoPerfilRecursoDialog){
            recursoService.listarTodos()
            .then((response) => setRecursos(response.data))
            .catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Erro ao carregar a lista de recursos .',
                    life: 3000
                })
            });
            perfilService.listarTodos()
            .then((response) =>
                setPerfis(response.data))
            .catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Erro ao carregar a lista de perfis.',
                    life: 3000
                });
            });
        }
    }, [permissaoPerfilRecursoDialog, perfilService, recursoService]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursosDialog = () => {
        setDeletePermissaoPerfilRecursosDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if (!permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService.inserir(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Permissão cadastrada com sucesso',
                        life: 3000
                    });
                }).catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Erro ao salvar.',
                        life: 3000
                    })
                });

        } else {
            permissaoPerfilRecursoService.alterar(permissaoPerfilRecurso)
                .then((response) => {
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Permissão alterada com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error.data.message);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar!' + error.data.message
                    })
                })
        }

    };

    const editPermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso({ ...permissaoPerfilRecurso });
        setPermissaoPerfilRecursoDialog(true);
    };

    const confirmDeletePermissaoPerfilRecurso = (permissaoPerfilRecurso: Projeto.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso); return
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deletePermissaoPerfilRecurso = () => {
        if (permissaoPerfilRecurso.id) {
            permissaoPerfilRecursoService.excluir(permissaoPerfilRecurso.id)
                .then((response) => {
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecursos(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'sucesso!',
                        detail: 'Permissão deletada com sucesso !',
                        life: 3000
                    });
                }).catch((error) => {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Erro ao deletar.',
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deleteSelectedPermissaoPerfilRecursos = () => {

        Promise.all(selectedPermissaoPerfilRecurso.map(async (_permissaoPerfilRecurso) => {
            if (_permissaoPerfilRecurso.id) {
                await permissaoPerfilRecursoService.excluir(_permissaoPerfilRecurso.id);
            }
        })).then((response) => {
            setPermissaoPerfilRecursos(null);
            setSelectedPermissaoPerfilRecurso([]);
            setDeletePermissaoPerfilRecursoDialog(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Permissões Deletadas com Sucesso!',
                life: 3000
            });
        }).catch((error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao deletar permissões!',
                life: 3000
            })
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        // let _perfil = { ...perfilUsuario };
        // _perfilUsuario[`${name}`] = val;

        // setPerfilUsuario(_perfilUsuario);
        setPermissaoPerfilRecurso(prevPermissaoPerfilRecurso => ({
            ...prevPermissaoPerfilRecurso,
            [name]: val,
        }));
};

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissaoPerfilRecurso || !(selectedPermissaoPerfilRecurso as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Perfil) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoPerfilRecurso(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Permissões de Perfil</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const permissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissaoPerfilRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPermissaoPerfilRecursos} />
        </>
    );

    const onSelectPerfilChange = (perfil: Projeto.Perfil) => {
        let _permissaoPerfilRecurso = {...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.perfil = perfil;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    };

    const onSelectRecursoChange = (recurso: Projeto.Recurso) => {
        let _permissaoPerfilRecurso = {...permissaoPerfilRecurso };
        _permissaoPerfilRecurso.recurso = recurso;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso)
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissaoPerfilRecurso}
                        selection={selectedPermissaoPerfilRecurso}
                        onSelectionChange={(e) => setSelectedPermissaoPerfilRecurso(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} permissões de perfil"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhuma permissão de perfil encontrado ."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Detalhes do perfil de usuário" modal className="p-fluid" footer={permissaoPerfilRecursoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                                <Dropdown optionLabel="descricao" value={permissaoPerfilRecurso.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil' />

                            {submitted && !permissaoPerfilRecurso.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="recurso">Recurso</label>

                            <Dropdown optionLabel="nome" value={permissaoPerfilRecurso.recurso} options={recursos} filter onChange={(e: DropdownChangeEvent) => onSelectRecursoChange(e.value)} placeholder='Selecione um recurso' />

                            {submitted && !permissaoPerfilRecurso.recurso && <small className="p-invalid">Recurso é obrigatório.</small>}
                        </div>
                            
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePermissaoPerfilRecursoDialogFooter} onHide={hideDeletePermissaoPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Você realmente deseja excluir a permissão?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePermissaoPerfilRecursoDialogFooter} onHide={hideDeletePermissaoPerfilRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && <span>Você realmente deseja excluir as permissões selecionadas?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;

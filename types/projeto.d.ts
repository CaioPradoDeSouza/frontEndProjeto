declare namespace Projeto{
    type Usuario ={
        id?: number;
        nome: string;
        senha: string;
        login: string;
        email: string;
    };

    type Recurso={
        id?: number;
        nome: string;
        chave: string;
    }

    type Perfil={
        id?: number;
        descricao: string;
        
    }

    type PerfilUsuario={
        id?: number;
        perfil: Perfil;
        usuario: Usuario;
        
    }

    type PermissaoPerfilRecurso={
        id?: number;
        perfil: Perfil;
        recurso: Recurso;
        
    }
}
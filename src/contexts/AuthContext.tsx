// Componentes React
import { createContext, ReactNode, useState, useEffect } from 'react';

// Componentes NextJS
import Router from 'next/router';

// API Client
import { api } from '../services/apiClient';

// Nookies
import { destroyCookie, setCookie, parseCookies } from 'nookies'

// React Toastify
import { toast } from 'react-toastify'

// // Types
// type AuthContextData = {
//   user: UserProps;
//   isAuthenticated: boolean;
//   role: string;
//   signIn: (credentials: SignInProps) => Promise<void>;
//   signOut: () => void;
//   signUp: (credentials: SignUpProps) => Promise<void>;
// }

// type UserProps = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// type SignInProps = {
//   email: string;
//   password: string;
// }

// type SignUpProps = {
//   name: string;
//   email: string;
//   password: string;
// }

// type AuthProviderProps = {
//   children: ReactNode;
// }

// export const AuthContext = createContext({} as AuthContextData)


// export function signOut(){
//   try{
//     destroyCookie(undefined, '@KVOrders.token')
//     Router.push('/')
//   }catch{
//     console.log('erro ao deslogar')
//   }
// }

// export function AuthProvider({ children }: AuthProviderProps){
//   const [user, setUser] = useState<UserProps>()
//   const role = user?.role
//   const isAuthenticated = !!user;

//   useEffect(() => {

//     const { '@KVOrders.token': token } = parseCookies();

//     if(token){
//       api.get('/user/detail').then(response => {
//         const { id, name, email, role } = response.data;

//         setUser({
//           id,
//           name,
//           email,
//           role
//         })

//       })
//       .catch(() => {
//         signOut();
//       })
//     }


//   }, [])

//   async function signIn({ email, password }: SignInProps){
//     try{
//       const response = await api.post('/user/auth', {
//         email,
//         password
//       })

//       const { id, name, token, role} = response.data;

//       setCookie(undefined, '@KVOrders.token', token, {
//         maxAge: 60 * 60 * 24 * 30,
//         path: "/" 
//       })

//       setUser({
//         id,
//         name,
//         email,
//         role
//       })


//       api.defaults.headers['Authorization'] = `Bearer ${token}`

//       toast.success('Logado com sucesso!')

//       Router.push('/dashboard')


//     }catch(err){
//       toast.error("Erro ao acessar!")
//       console.log("ERRO AO ACESSAR ", err)
//     }
//   }


//   async function signUp({ name, email, password}: SignUpProps){
//     try{

//       const response = await api.post('/user/create', {
//         name,
//         email,
//         password
//       })

//       toast.success("Conta criada com sucesso!")

//       Router.push('/')

//     }catch(err){
//       toast.error("Erro ao cadastrar!")
//       console.log("erro ao cadastrar ", err)
//     }
//   }

//   return(
//     <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp, role }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }



// import { createContext, ReactNode, useState, useEffect } from 'react';
// import Router from 'next/router';
// import { api } from '../services/apiClient';
// import { toast } from 'react-toastify';

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  role: string;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@KVOrders.token');
    Router.push('/');
  } catch {
    console.log('erro ao deslogar');
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const role = user?.role;
  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@KVOrders.token': token } = parseCookies();

    if (token) {
      api
        .get('/user/detail')
        .then(response => {
          const { id, name, email, role } = response.data;

          setUser({
            id,
            name,
            email,
            role,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post('/user/auth', {
        email,
        password,
      });

      const { id, name, token, role } = response.data;

      if (role === 'garcom') {
        toast.error('Acesso negado!');
        return;
      }

      setCookie(undefined, '@KVOrders.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });

      setUser({
        id,
        name,
        email,
        role,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      toast.success('Logado com sucesso!');

      if (role === "cliente" || role === "garcom") {
        Router.push("/pagina-do-cliente");
      } else if (role === "caixa") {
        Router.push("/finish");
      } else {
        Router.push('/dashboard');
      }


    } catch (err) {
      toast.error('Erro ao acessar!');
      console.log('ERRO AO ACESSAR ', err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post('/user/create', {
        name,
        email,
        password,
      });

      toast.success('Conta criada com sucesso!');

      Router.push('/users');
    } catch (err) {
      toast.error('Erro ao cadastrar!');
      console.log('erro ao cadastrar ', err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp, role }}>
      {children}
    </AuthContext.Provider>
  );
}

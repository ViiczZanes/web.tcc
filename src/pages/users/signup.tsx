// Componentes React
import { useContext, FormEvent, useState } from 'react'

// Componentes NextJS
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';

// Styles & Logo & Ícones
import styles from '../../../styles/index.module.scss';
import logoImg from '../../../public/logo.svg';

// Componentes Próprios
import { Input } from '../../components/Form/Input/Input'
import { Button } from '../../components/Form/Button/Button'

// React Toastify
import { toast } from 'react-toastify'

// Context & Autorização 
import { AuthContext } from '../../contexts/AuthContext'

//Hooks Próprios
import useForm from '../../hooks/useForm';
import { GetServerSideProps } from 'next';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { Header } from '../../components/Header/Header';
import { BiArrowBack } from 'react-icons/bi';
import Router from 'next/router';


export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const name = useForm("")
  const email = useForm("email")
  const password = useForm("password")

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (name.value === '' || email.value === '' || password.value === '') {
      toast.error("Preencha todos os campos")
      return;
    }

    setLoading(true);

    let data = {
      name: name.value,
      email: email.value,
      password: password.value
    }

    await signUp(data)

    setLoading(false);

  }

  return (
    <>
      <Header />
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>



      <div className={styles.container} style={{ width: '100%', height: '100%', marginTop: '3rem' }}>
        <h1 style={{ color: '#fff' }}>Criando sua conta</h1>

        <form onSubmit={handleSignUp}>
          <Input
            placeholder="Digite seu nome"
            type="text"
            {...name}
          />

          <Input
            placeholder="Digite seu email"
            type="text"
            {...email}
          />

          <Input
            placeholder="Sua senha"
            type="password"
            {...password}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Cadastrar
          </Button>
        </form>

        {/* <Link href="/">
          <a className={styles.text}>Já possui uma conta? <span>Faça login!</span></a>
        </Link> */}

      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return canSSRAuth(['admin'], async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/users');

    return {
      props: {
        usersList: response.data
      },
    };
  })(ctx);
};


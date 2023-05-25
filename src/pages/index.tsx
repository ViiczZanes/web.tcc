// Componentes React
import { useContext, FormEvent, useState } from 'react'

// Componentes NextJS
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';

// Styles & Logo & Ícones
import styles from '../../styles/index.module.scss';
import logoImg from '../../public/logo.png';

// Componentes Próprios
import { Input } from '../components/Form/Input/Input'
import { Button } from '../components/Form/Button/Button'

// React Toastify
import { toast } from 'react-toastify'

// Context & Autorização 
import { AuthContext } from '../contexts/AuthContext'
import { canSSRGuest } from '../utils/canSSRGuest'


//Hooks Próprios
import useForm from '../hooks/useForm';

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [loading, setLoading] = useState(false);

  const email = useForm("email");
  const password = useForm("password");


  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email.value === '' || password.value === '') {
      toast.error("Preencha os campos")
      return;
    }

    setLoading(true);

    const data = {
      email: email.value,
      password: password.value
    }

    await signIn(data)

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu login</title>
      </Head>
      <div className={styles.container}>
        <Image width={450} className={'logo'} src={logoImg} alt="Logo" />

        <form onSubmit={handleLogin}>
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
            Acessar
          </Button>
        </form>

        {/* <Link href="/signup">
          <a className={styles.text}>Nao possui uma conta? <span>Cadastre-se</span></a>
        </Link> */}
      </div>
    </>
  )
}


export const getServerSideProps = canSSRGuest(async (context) => {

  return {
    props: {}
  }
})
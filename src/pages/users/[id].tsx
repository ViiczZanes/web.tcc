import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Header } from '../../components/Header/Header';
import { Input } from '../../components/Form/Input/Input';
import styles from '../../../styles/users.module.scss';
import { Switch } from "@material-ui/core";
import { toast } from 'react-toastify';

import { BiArrowBack } from 'react-icons/bi'

type UserProps = {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Users = () => {
  const router = useRouter();
  const user_id = router.query.id

  const [user, setUser] = useState<UserProps>()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    api.get('/user/info', {
      params: {
        user_id
      }
    }).then(response => {
      const { id, name, email, role } = response.data;

      setUser({
        id,
        name,
        email,
        role
      })
      setName(name)
      setEmail(email)
      setSelectedRole(role);
    })
  }, [user_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let data = {}

    if (password === '') {
      data = {
        id: user_id,
        name,
        email,
        role: selectedRole,
      }
    } else if (password !== confirmPassword) {
      toast.error('As Senhas Precisam Ser Iguais')
      return
    } else {
      data = {
        id: user_id,
        name,
        email,
        newPassword: password,
        role: selectedRole,
      }
    }

    try {
      await api.put('/user/update', data)
      toast.success('Dados atualizados com sucesso!')
      Router.back()
    } catch (err) {
      toast.error('Erro ao atualizar dados, tente novamente mais tarde.')
      Router.back()
    }
  }

  return (
    <>
      <Header />


      <div className={styles.container}>
        <div>{<BiArrowBack style={{fontSize: '2rem', color: '#fff', cursor: 'pointer'}} onClick={() => {
          Router.back()
        }}/>}</div>
        <h1 style={{ color: 'var(--white)' }}>Detalhes Usuário</h1>
        <form className={styles.formDetails} onSubmit={handleSubmit}>
          <h2 className={styles.h2}>Nome</h2>
          <Input
            placeholder="Digite seu Nome"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            error=''
            style={{ width: '100%' }}
          />
          <h2 className={styles.h2}>Email</h2>
          <Input
            placeholder="Digite seu email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error=''
            style={{ width: '100%' }}
          />
          <h2 className={styles.h2}>Alterar Senha</h2>
          <Input
            placeholder="Digite sua Senha"
            type="text"
            error=''
            style={{ width: '100%' }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirme Sua Senha"
            type="text"
            error=''
            style={{ width: '100%' }}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <div className={styles.selectWrapper}>
            <h2 className={styles.h2}>Cargo</h2>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className={styles.select}
            >
              <option value="admin">Admin</option>
              <option value="cozinha">Cozinha</option>
              <option value="garcom">Garçom</option>
              <option value="caixa">Caixa</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
          <button className={styles.btn} type="submit">Enviar</button>
        </form>
      </div>
    </>
  )
}

export default Users

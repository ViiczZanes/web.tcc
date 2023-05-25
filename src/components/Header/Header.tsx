import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Header.module.scss";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/apiClient";
import Image from "next/image";

export function Header() {
  const { signOut, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (role === "cliente" || role === "garcom") {
      router.push("/pagina-do-cliente");
    }
  }, [role, router]);

  const isAuthorized = (allowedRoles) => {
    if (role === "admin") {
      return true; // Permite acesso total para a role "admin"
    }

    // Verifica se a role atual do usuário está presente nas roles permitidas
    return allowedRoles.includes(role);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/"); // Redireciona para a página inicial após o logout
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" passHref>
          <Image src="/logo.png" className={'logo'} alt="kvorders" width={190} height={60} />
        </Link>

        <nav className={styles.menuNav}>
          {isAuthorized(["admin"]) && (
            <Link href="/category">
              <a>Categoria</a>
            </Link>
          )}
          {isAuthorized(["admin"]) && (
            <Link href="/finish">
              <a>Finalizar</a>
            </Link>
          )}
          {isAuthorized(["admin"]) && (
            <Link href="/product">
              <a className="active">Produto</a>
            </Link>
          )}
          {isAuthorized(["admin"]) && (
            <Link href="/users">
              <a>Usuários</a>
            </Link>
          )}
          {isAuthorized(["admin"]) && (
            <Link href="/tables">
              <a>Mesas</a>
            </Link>
          )}
          {isAuthorized(["admin"]) && (
            <Link href="/menu">
              <a>Cardápio</a>
            </Link>
          )}
          <button onClick={handleSignOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}

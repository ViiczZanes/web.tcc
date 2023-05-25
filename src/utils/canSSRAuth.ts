import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import jwtDecode from "jwt-decode";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

type DecodedToken = {
  role: string;
  // Outras propriedades do token, se houver
};


export function canSSRAuth<P>(allowedRoles: string[], fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['@KVOrders.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      const decodedToken = jwtDecode(token) as DecodedToken;
      const userRole = decodedToken.role;

      if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
        return {
          redirect: {
            destination: '/acesso-negado',
            permanent: false,
          },
        };
      }

      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@KVOrders.token');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}

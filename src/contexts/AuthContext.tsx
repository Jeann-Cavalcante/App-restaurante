import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { api } from "../services/apiClient";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SingInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
  category: (credential: categoryProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SingInProps = {
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

type categoryProps = {
  name: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    console.log("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user; //!! transforma em boolean

  useEffect(() => {
    // tentar pegar algo no cookie
    const { "@nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({
            id,
            name,
            email,
          });
        })
        .catch(() => {
          //Se eu erro deslogamos o user
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SingInProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });
      // console.log(response.data);

      const { id, name, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // Expira em 1 Mês
        path: "/", // Quais caminhos terão acesso ao cookie
      });

      setUser({
        id,
        name,
        email,
      });

      //Passar para proxima requisiçoes o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso!");

      //Redirecionar o user para /dashboard
      Router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao acessar");
      console.log("Erro ao acessa", err);
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
      });

      toast.success("Cadastro realizado com sucesso");

      Router.push("/");
    } catch (err) {
      toast.error("Erro ao cadastrar");
      console.log("Erro ao cadastrar", err);
    }
  }

  async function category(name: categoryProps) {
    try {
      const response = await api.post("/category", name);
      toast.success("Cadastro realizado com sucesso");
      Router.push("/");
    } catch (err) {
      toast.error("Erro ao cadastrar");
      console.log("Erro ao cadastrar", err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp, category }}
    >
      {children}
    </AuthContext.Provider>
  );
}

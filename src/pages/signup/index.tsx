import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

import logoImg from "../../../public/logo.svg";
import styles from "../../../styles/Home.module.scss";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/input";
import { AuthContext } from "../../contexts/AuthContext";

export default function Signup() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "" || name === "") {
      toast.warning("Preencha os dados");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
    };
    await signUp(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="logo" />

        <div className={styles.login}>
          <h1>Criando sua conta </h1>
          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Digite seu email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>
          <Link href="/">
            <a className={styles.text}>Já possui uma conta? faça login!</a>
          </Link>
        </div>
      </div>
    </>
  );
}

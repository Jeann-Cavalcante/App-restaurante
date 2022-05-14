import Head from "next/head";
import Image from "next/image";

import logoImg from "../../public/logo.svg";
import styles from "../../styles/Home.module.scss";
import { Input } from "../components/ui/input";

export default function Home() {
  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="logo" />

        <div className={styles.login}>
          <form>
            <Input placeholder="Digite seu email" type="email" />
            <Input placeholder="Digite sua senha" type="password" />
          </form>
        </div>
      </div>
    </>
  );
}

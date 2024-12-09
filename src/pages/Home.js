import { Link } from 'react-router-dom';

import styles from './css/Home.module.css'

function Home() {
  return (
    <div className={styles.container}>
      <h1>Bem vindo a TechCota</h1>
      <h2 className={styles.subtitle}>O seu site de gerar orçamentos de forma facilitada.</h2>
      <div className={styles.buttonContainer}>
        <Link to="/login" className={styles.button}>
          Faça login
        </Link>
        <h4>ou</h4>
        <Link to="/register" className={styles.button}>
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}

export default Home;
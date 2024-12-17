import { useContext, useState } from 'react';

import { Context } from '../../context/UserContext'
import styles from '../css/Form.module.css'
import Input from '../../components/Input';
import { Link } from 'react-router-dom';


function Register() {
  const { register } = useContext(Context);
  const [user, setUser] = useState({});

  function onFileChange(e) {
    setUser({ ...user, [e.target.name]: e.target.files[0]})
  }

  const handleChange = (e) => { //TODO: when backend's controller "register" changes, this function will have to change too (check Settings page for example)
    const { name, value } = e.target;
    setUser({...user, [name]: value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let key in user) {
      formData.append(key, user[key]);
    }
    
    register(formData); //Context provided function to send user to db
  };

  return (
    <>
      <h1>Cadastrar-se</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Informações do Usuário</h3>
          <div className={styles.formGroup}>
              <Input
                text="Nome"
                type="text"
                name="name"
                placeholder="Digite seu nome..."
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="E-mail"
                type="email"
                name="email"
                placeholder="Digite seu e-mail..."
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Senha"
                type="password"
                name="password"
                placeholder="Digite sua senha..."
                handleOnChange={handleChange}
                required
              />
          <p className={styles.hint}>- A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.</p>
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Confirmação de senha"
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha..."
                handleOnChange={handleChange}
                required
              />
            {user.password !== user.confirmPassword &&
              <p className={styles.error}>As senhas não coincidem!</p>
            }
          </div>

          <div className={styles.formGroup}>
            <p className={styles.hint}>Já possui uma conta ? <span><Link to='/login'>Clique aqui</Link></span> e faça Login!</p>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Preço/Hora do Serviço</h3>
          <div className={styles.formGroup}>
              <Input
                text="Preço/Hora manutenção"
                type="number"
                name="maintenance"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Preço/Hora criação"
                type="number"
                name="creation"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Preço/Hora desenvolvimento"
                type="number"
                name="development"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Preço/Hora integração"
                type="number"
                name="integration"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Preço/Hora extra"
                type="number"
                name="extra"
                handleOnChange={handleChange}
                required
              />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Dados da Empresa</h3>
          <div className={styles.formGroup}>
              <Input
                text="Nome da empresa"
                type="text"
                name="companyName"
                placeholder="Digite o nome da empresa..."
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="CNPJ"
                type="text"
                name="cnpj"
                placeholder="xx.xxx.xxx/xxxx-xx" 
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Endereço"
                type="text"
                name="address"
                placeholder="Digite o endereço..."
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Email para contato"
                type="email"
                name="contactEmail"
                placeholder="email@empresa.com.br"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Telefone para contato"
                type="text"
                name="contactPhone"
                placeholder="(XX) XXXXX-XXXX"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Site da empresa"
                type="url"
                name="website"
                placeholder="www.exemplo.com.br"
                handleOnChange={handleChange}
                required
              />
          </div>

          <div className={styles.formGroup}>
              <Input
                text="Logo da empresa"
                type="file"
                name="logo"
                handleOnChange={onFileChange}
              />
          </div>
        </div>

        <input className={styles.submitButton} type="submit" value="Cadastrar"/>
      </form>
    </>
  );
}

export default Register
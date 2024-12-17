import Input from '../../components/Input'
import styles from '../css/Form.module.css'

import { Context } from '../../context/UserContext'

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'

function Login() {

	const [user, setUser] = useState({})
	const { login } = useContext(Context)

	function handleChange(e) {
			setUser({ ...user, [e.target.name]: e.target.value})
	}

	function handleSubmit(e) {
			e.preventDefault()
			login(user)
	}

	return (
	<>
		<h1>Informações de Login</h1>
		<form onSubmit={handleSubmit} className={styles.formSingleCol} id='login'>
			<div className={styles.section} >
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
				</div>
				<input className={styles.submitButton} type="submit" value="Login"/>
			</div>

			<div className={styles.formGroup}>
            	<p className={styles.hint}>Não possui uma conta ? <span><Link to='/register'>Clique aqui</Link></span> e cadastre-se!</p>
          	</div>
		</form>
	</>
	)
}

export default Login
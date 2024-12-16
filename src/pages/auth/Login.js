import Input from '../../components/Input'
import styles from '../css/Form.module.css'

import { Context } from '../../context/UserContext'

import { useContext, useState } from 'react';

//TODO: Align this form to the center
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
	<form onSubmit={handleSubmit} className={styles.form} id='login'>
			<div className={styles.section} >
					<h3>Informações do Usuário</h3>
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
							handleOnChange={handleChange}
							required
							/>
					</div>
			</div>
		<input type="submit" value="Login"/>
	</form>
	)
}

export default Login
import { useEffect, useState } from 'react'

import styles from './css/Form.module.css'
import api from '../utils/api'
import useFlashMessage from '../hooks/useFlashMessage'

import Input from '../components/Input'

/*TODO:
- change spacing between submit button and form
*/
function Settings() {
	const [preview, setPreview] = useState('');
	const [settings, setSettings] = useState({
    companyName: '',
    cnpj: '',
    serviceRates: {
      maintenance: '',
      creation: '',
      development: '',
      integration: '',
      extra: ''
    },
    minInstallmentValue: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    logo: ''
  });
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage()

  // Get user settings
  useEffect(() => {
    let msgType = 'error'
      api.get('/user/settings', {
          headers: {
              Authorization: `Bearer ${JSON.parse(token)}`
          }
      }).then((response) => {
          setSettings(response.data)
      }).catch((error) => {
          return setFlashMessage(msgType, error.response.data.message)
      })
    }, [token])

	function onFileChange(e) {
    setPreview(e.target.files[0])
    setSettings({ ...settings, [e.target.name]: e.target.files[0]})
  }

  function handleChange(e) {
    const { name, value } = e.target;
  
    if (name in settings.serviceRates) {
      setSettings((settings) => ({
        ...settings,
        serviceRates: {
          ...settings.serviceRates,
          [name]: value,
        },
      }));
    } else {
      setSettings((settings) => ({
        ...settings,
        [name]: value,
      }));
    }
  }  

	async function handleSubmit(e){
		e.preventDefault()

    let msgType = 'sucess'

    const data = await api.patch(`/user/settings`, settings, {
      headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
        return response.data
    }).catch((err) => {
        msgType = 'error'
        return err.response.data
    })

    setFlashMessage(data.message, msgType)
	}

	return (
    <>
    <h1>Configurações de Usuário</h1>
		<form onSubmit={handleSubmit} className={styles.formDoubleCol}>
			<div className={styles.section}>
        <h3>Preço/Hora do Serviço</h3>
        <div className={styles.formGroup}>
            <Input
              text="Preço/Hora manutenção"
              type="number"
              name="maintenance"
              value={settings.serviceRates.maintenance}
              handleOnChange={handleChange}
              required
            />
        </div>

        <div className={styles.formGroup}>
            <Input
              text="Preço/Hora criação"
              type="number"
              name="creation"
              value={settings.serviceRates.creation}
              handleOnChange={handleChange}
              required
            />
        </div>

        <div className={styles.formGroup}>
            <Input
              text="Preço/Hora desenvolvimento"
              type="number"
              name="development"
              value={settings.serviceRates.development}
              handleOnChange={handleChange}
              required
            />
        </div>

        <div className={styles.formGroup}>
            <Input
              text="Preço/Hora integração"
              type="number"
              name="integration"
              value={settings.serviceRates.integration}
              handleOnChange={handleChange}
              required
            />
        </div>

        <div className={styles.formGroup}>
            <Input
              text="Preço/Hora extra"
              type="number"
              name="extra"
              value={settings.serviceRates.extra}
              handleOnChange={handleChange}
              required
            />
        </div>

        <h3>Outros Valores</h3>

        <div className={styles.formGroup}>
            <Input
              text="Valor mínimo da parcela"
              type="number"
              name="minInstallmentValue"
              value={settings.minInstallmentValue}
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
              value={settings.companyName}
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
              value={settings.cnpj}
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
              value={settings.address}
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
              value={settings.contactEmail}
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
              value={settings.contactPhone}
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
              value={settings.website}
              placeholder="www.exemplo.com.br"
              handleOnChange={handleChange}
              required
            />
        </div>

        <div className={styles.previewGroup}>
          <div className={styles.formGroup}>
            <Input
              text="Logo da empresa"
              type="file"
              name="logo"
              handleOnChange={onFileChange}
            />
        </div>
					
					{(settings.logo || preview) && (
            <img src={preview 
              ? URL.createObjectURL(preview)
              : `${process.env.REACT_APP_API_URL}/logos/${settings.logo}` //Change to API URL
            } 
              alt={settings.companyName}
              className={styles.preview}
            />
          )}
				</div>

        
      </div>		

      <input className={styles.submitButton} type="submit" value="Atualizar Dados"/>
		</form>
    </>
	)
}

export default Settings
import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { MdCancel, MdCheckBox } from "react-icons/md";

import api from '../../utils/api';
import styles from '../css/CreateBudget.module.css';
import useFlashMessage from '../../hooks/useFlashMessage';

function EditBudget() {
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [minInstallmentValue, setMinInstallmentValue] = useState(0);
  const [serviceRates, setServiceRates] = useState({
    maintenance: 0,
    creation: 0,
    development: 0,
    integration: 0,
    extra: 0
  });
  const [useOriginalParams, setUseOriginalParams] = useState(true);
  const [originalParams, setOriginalParams] = useState({serviceRates: serviceRates, minInstallmentValue: 0});
  const [newParams, setNewParams] = useState({serviceRates: serviceRates, minInstallmentValue: 0});
  let alreadyFetchedBudget = false;
  let alreadyFetchedParams = false;

  //table row title
  const trTitle = {
    maintenance: 'Manutenção',
    creation: 'Criação',
    development: 'Desenvolvimento',
    integration: 'Integração',
    extra: 'Extra'
  }

  //create budget form
  const [budgetData, setBudgetData] = useState({
    generalVision: '',
    proposal: '',
    startDate: '',
    endDate: '',
    status: '',
    hoursAndValues: {
      maintenanceHours: 0,
      creationHours: 0,
      developmentHours: 0,
      integrationHours: 0,
      extraHours: 0,
    },
    installments: [],
  });

  //format budget to use in table
  function formatBudget(budget){
    let formattedBudget = {
      generalVision: budget.generalVision,
      proposal: budget.proposal,
      startDate: budget.startDate.split('T')[0],
      endDate: budget.endDate.split('T')[0],
      status: budget.status,
      hoursAndValues: {
        maintenanceHours: budget.hoursAndValues.maintenanceHours,
        creationHours: budget.hoursAndValues.creationHours,
        developmentHours: budget.hoursAndValues.developmentHours,
        integrationHours: budget.hoursAndValues.integrationHours,
        extraHours: budget.hoursAndValues.extraHours,
      },
      installments: budget.installments,
    }
    return formattedBudget
  }

  //initialize budget data and original params
  //to get each service rate using a "hoursAndValues" map, we use the replace method to remove the 'Hours' from the key name. Using 3x in table.
  useEffect(() => {
    if(token && !alreadyFetchedBudget){
      //get budget data to edit
      api.get(`/budget/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      }).then((response) => {
        setBudgetData(formatBudget(response.data))
        setOriginalParams({
          serviceRates: response.data.ratesUsed,
          minInstallmentValue: response.data.minInstallmentValue
        })
      }).catch((error) => {
        return setFlashMessage(error.response.data.message, 'error')
      })
    } 

    if(token && !alreadyFetchedParams){
      api.get('/user/settings', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      }).then((response) => {
        setNewParams({
          serviceRates: response.data.serviceRates, 
          minInstallmentValue: response.data.minInstallmentValue
        })
      }).catch((error) => {
        return setFlashMessage(error.response.data.message, 'error')
      })
    }

    alreadyFetchedParams = true;
    
    alreadyFetchedBudget = true;
  }, [token]);

  //apply params to budget data
  useEffect(() => {
    if(useOriginalParams){
      setServiceRates(originalParams.serviceRates)
      setMinInstallmentValue(originalParams.minInstallmentValue)
    } else {
      setServiceRates(newParams.serviceRates)
      setMinInstallmentValue(newParams.minInstallmentValue)
    }
  }, [useOriginalParams, newParams, originalParams])

  //change handlers
  function handleChange(e){
    const { name, value } = e.target;
    setBudgetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  function handleHoursChange(e){
    const { name, value } = e.target;
    
    //prevents negatives values from being typed
    if(value.includes('-')){
      return
    }

    setBudgetData((prev) => ({
      ...prev,
      hoursAndValues: {
        ...prev.hoursAndValues,
        [name]: Number(value),
      },
    }));
  };

  async function handleSubmit(e){
    e.preventDefault();
    
    let msgType = 'success';

    if(budgetData.generalVision === '' || budgetData.proposal === '' || budgetData.startDate === '' || budgetData.endDate === '' || totalCost === 0){
      msgType = 'error';
      return setFlashMessage('Preencha todos os campos obrigatórios.', msgType);
    }

    budgetData.ratesUsed = serviceRates;
    budgetData.minInstallmentValue = minInstallmentValue;
    
    const data = await api.put(`/budget/${id}`, budgetData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      return response.data;
    }).catch((error) => {
      msgType = 'error';
      return error.response.data;
    })

    setFlashMessage(data.message, msgType);

    if(msgType === 'success'){
      navigate('/budget');
    }
  }

  function handleParamUsage(e){
    const { name, value } = e.target;
    
    setUseOriginalParams(value);
  }

  //calculate and set total cost
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const { hoursAndValues } = budgetData;
    const total = Object.keys(hoursAndValues).reduce((sum, key) => {
      const rateKey = key.replace('Hours', '');
      const rate = serviceRates[rateKey] || 0;
      return sum + hoursAndValues[key] * rate;
    }, 0);
    setTotalCost(total);
  }, [budgetData.hoursAndValues, serviceRates]);
  //needs updated budgetData.hoursAndValues to calculate total cost, so it's a dependency

  //calculate and set installments
  useEffect(() => {
    if(totalCost > 0){
      // Calculate the number of project months based on the start and end dates
      const start = new Date(budgetData.startDate);
      const end = new Date(budgetData.endDate);
      const months = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));

      const installments = calculateInstallments(totalCost, months);

      setBudgetData((prev) => ({
        ...prev,
        installments: installments,
      }));
    }
  }, [budgetData.startDate, budgetData.endDate, totalCost]);

  //FIXME: last installment is 1 cent less when division results in a repeated decimal
  function calculateInstallments(totalAmount, projectMonths) {
    const minimumInstallment = minInstallmentValue;
    
    // 1. First, check if the minimum can be maintained until the second-to-last installment
    const minimumAmountRequired = minimumInstallment * (projectMonths - 1);
    
    // 2. If the minimum can't be maintained until the second-to-last, divide equally
    if (totalAmount <= minimumAmountRequired) {
        const equalInstallment = parseFloat((totalAmount / projectMonths).toFixed(2));
        return Array(projectMonths).fill(equalInstallment);
    }
    
    // 3. If the minimum can be maintained, check if dividing equally is better
    const equalInstallment = parseFloat((totalAmount / projectMonths).toFixed(2));
    if (equalInstallment >= minimumInstallment) {
        return Array(projectMonths).fill(equalInstallment);
    }
    
    // 4. If dividing equally is not better, maintain the minimum until the second-to-last
    // and put the remainder in the last installment
    let installments = [];
    let remainingAmount = totalAmount;
    
    for (let i = 0; i < projectMonths - 1; i++) {
        installments.push(minimumInstallment);
        remainingAmount -= minimumInstallment;
    }
    
    installments.push(parseFloat(remainingAmount.toFixed(2)));
    
    return installments;
  }

  return (
    <>
      <h1>Criar Orçamento</h1>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.dropdownGroup}>
            <div>
              Escolha quais parâmetros serão usados para o orçamento (valor por hora e valor mínimo da parcela):
              <select name="paramUsage" id="paramUsage" onChange={handleParamUsage}>
                <option value="true">Parâmetros originais</option>
                <option value="false">Parâmetros novos</option>
              </select>
            </div>
            <div>
              Status atual do orçamento:
              <select name="status" id="status" value={budgetData.status} onChange={handleChange}>
                <option value="pending" >Pendente</option>
                <option value="approved" >Aprovado</option>
              </select>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="generalVision">Visão Geral</label>
            <textarea
              id="generalVision"
              name="generalVision"
              rows="4"
              value={budgetData.generalVision}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="proposal">Proposta</label>
            <textarea
              id="proposal"
              name="proposal"
              rows="4"
              value={budgetData.proposal}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dates">Datas</label>
            <div className={styles.dateGroup}>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={budgetData.startDate}
                onChange={handleChange}
              />
              <span> - </span>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={budgetData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h3>Valores x Horas</h3>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Horas</th>
                  <th>Valor/Hora</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(budgetData.hoursAndValues).map((key) => (
                  <tr key={key}>
                    <td>{trTitle[`${key.replace('Hours', '')}`]}</td>
                    <td>
                      <input
                        type="number"
                        name={key}
                        value={budgetData.hoursAndValues[key]}
                        min={0}
                        onChange={handleHoursChange}
                      />
                    </td>
                    <td>
                      {'R$ ' + serviceRates[`${key.replace('Hours', '')}`]}
                    </td>
                    <td>
                      {'R$ ' + budgetData.hoursAndValues[key] * (serviceRates[`${key.replace('Hours', '')}`])}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className={styles.tableFooter}>
                <tr>
                  <td colSpan="3">
                    <span>Condições de pagamento:</span> à vista, ou em até {budgetData.installments.length} vezes, nas seguintes parcelas: {
                    budgetData.installments.map((installment, i) => {
                      return(
                        <Fragment key={i}><span>{` ${i + 1}°:`}</span> {`R$ ${installment.toFixed(2)} \t`}</Fragment>
                      )
                    })}
                  </td>
                  <td><span>Total:</span> {'R$ ' + totalCost}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className={styles.submitButtons}>
            <Link to='/budget' className={styles.cancelSubmitButton}>
              Cancelar
              <div className={styles.buttonIcon}><MdCancel /></div>
            </Link>
            <button type='submit' className={styles.approveSubmitButton}>
              Criar Orçamento
              <div className={styles.buttonIcon}><MdCheckBox /></div>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditBudget;

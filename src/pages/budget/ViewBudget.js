import React, { useState, useEffect, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MdArrowBack, MdPictureAsPdf } from "react-icons/md";

import api from '../../utils/api';
import styles from '../css/CreateBudget.module.css';
import useFlashMessage from '../../hooks/useFlashMessage';

function ViewbudgetData() {
    const [token] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage();
    const { id } = useParams();
    const [budgetData, setBudgetData] = useState({
        generalVision: '',
        proposal: '',
        startDate: '',
        endDate: '',
        status: '',
        ratesUsed: {
            maintenance: 0,
            creation: 0,
            development: 0,
            integration: 0,
            extra: 0,
        },
        hours: {
            maintenanceHours: 0,
            creationHours: 0,
            developmentHours: 0,
            integrationHours: 0,
            extraHours: 0,
        },
        values: {
            maintenanceValue: 0,
            creationValue: 0,
            developmentValue: 0,
            integrationValue: 0,
            extraValue: 0,
        },
        minInstallmentValue: 0,
        installments: [],
        createdAt: '',
        updatedAt: '',
        totalCost: 0,
        });

    //table row title
    const trTitle = {
        maintenance: 'Manutenção',
        creation: 'Criação',
        development: 'Desenvolvimento',
        integration: 'Integração',
        extra: 'Extra'
    }

    useEffect(() => {
        if(token) {
            api.get(`/budget/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                },
            }).then((response) => {
                const {generalVision, proposal, startDate, endDate, status, ratesUsed, hoursAndValues, installments, createdAt, updatedAt, minInstallmentValue} = response.data
                const fStartDate = startDate.split('T')[0]
                const fEndDate = endDate.split('T')[0]
                setBudgetData({
                    generalVision: generalVision,
                    proposal: proposal,
                    startDate: new Date(fStartDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'}),
                    endDate: new Date(fEndDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'}),
                    status: status,
                    ratesUsed: ratesUsed,
                    hours: Object.fromEntries(
                        //get object properties as an array and filter them, then convert them to back an object using Object.fromEntries
                        Object.entries(hoursAndValues).filter(([key]) => key.includes('Hours'))
                    ),
                    values:Object.fromEntries(
                        Object.entries(hoursAndValues).filter(([key]) => key.includes('Value'))
                    ),
                    minInstallmentValue: minInstallmentValue,
                    installments: installments,
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                    totalCost: Object.entries(hoursAndValues).reduce((acc, [key, value]) => { 
                            return key.includes('Value') ? acc + value : acc;
                        }, 0)
                });
            }).catch((error) => {
                console.error('Erro ao buscar dados do orçamento:', error);
            });
        } else {
            setFlashMessage('Erro interno.', 'error');
        }
    }, [token]);

    //handlers
    function handleGeneratePDF(id) {
        api.post(`/budget/generate-pdf/${id}`, {}, { //pdf won't work if it's not a get request or a post request with a body (empty braces) {}
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            },
            responseType: 'blob',
        }).then((response) => {
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        }).catch((error) => {
            setFlashMessage(error.response.data.message ?? 'Erro ao buscar', 'error');
        })
    }

    return (
        <>
            <h1>Criar Orçamento</h1>
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <div className={styles.fieldGroup}>
                        <h3>Status atual do orçamento</h3>
                        <span className={budgetData.status === 'approved' ? styles.approvedStatusHeader : styles.pendingStatusHeader}>
                            {budgetData.status === 'approved' ? 'Aprovado' : 'Pendente'}
                        </span>
                    </div>
                    <div className={styles.fieldGroup}>
                        <h3>Período do Projeto</h3>
                        <div className={styles.dateGroup}>
                            <p>{(budgetData.startDate)} - {budgetData.endDate}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.fieldGroup}>
                    <h3>Visão Geral</h3>
                    <p>{budgetData.generalVision}</p>
                </div>
                <div className={styles.fieldGroup}>
                    <h3>Proposta</h3>
                    <p>{budgetData.proposal}</p>
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
                            {Object.keys(budgetData.hours).map((key) => (
                                <tr key={key}>
                                    <td>{trTitle[`${key.replace('Hours', '')}`]}</td>
                                    <td>{budgetData.hours[key]}</td>
                                    <td>{'R$ ' + budgetData.ratesUsed[`${key.replace('Hours', '')}`]}</td>
                                    <td>{'R$ ' + budgetData.values[`${key.replace('Hours','Value')}`]}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className={styles.tableFooter}>
                            <tr>
                                <td colSpan="3">
                                    <span>Condições de pagamento:</span> à vista, ou em até {budgetData.installments.length} vezes, nas seguintes parcelas: 
                                    {budgetData.installments.map((installment, i) => (
                                        <Fragment key={i}>
                                            <span>{` ${i + 1}°:`}</span> {`R$ ${installment} 	`}
                                        </Fragment>
                                    ))}
                                </td>
                                <td><span>Total:</span> {'R$ ' + budgetData.totalCost}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className={styles.submitButtons}>
                    <Link to='/budget' className={styles.cancelSubmitButton}>
                        Retornar
                        <div className={styles.buttonIcon}><MdArrowBack /></div>
                    </Link>
                    <button type='button' className={styles.approveSubmitButton} onClick={() => handleGeneratePDF(id)}>
                        Gerar PDF
                        <div className={styles.buttonIcon}><MdPictureAsPdf /></div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ViewbudgetData;
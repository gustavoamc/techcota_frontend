import  api from '../../utils/api'
import styles from '../css/Budgets.module.css'
import useFlashMessage from '../../hooks/useFlashMessage'

import { useEffect, useState } from 'react'
import { MdSearch, MdOutlineAdd, MdOutlineWysiwyg, MdEdit, MdDelete, MdPictureAsPdf } from "react-icons/md";
import { Link } from 'react-router-dom'

/*TODO: 
- change to switch case if more than 2 status
- change remove confirmation window to modal
- adapt pdf button when it's ready
- implement search bar: filtering line 58 and function line 70
- implement date filtering - line 63
- implement ordering by clicking on column header
*/

//FIXME: line 130-131 "toLocaleDateString" is using timezone but in the db it's simple dates

function Budgets() {
		const [budgets, setBudgets] = useState([])
		const [searchTerm, setSearchTerm] = useState('')
		const [startDateFilter, setstartDateFilter] = useState('')
		const [endDateFilter, setEndDateFilter] = useState('')
		const [token] = useState(localStorage.getItem('token') || '')
		const { setFlashMessage } = useFlashMessage()

		useEffect(() => {
			api.get('/budget/all', {
					headers: {
							Authorization: `Bearer ${JSON.parse(token)}`
					}
			})
			.then((response) => {
					setBudgets(response.data.budgets)
			})
			.catch((error) => {
					setFlashMessage(error.response.data.message, 'error') //msg type
			})
		}, [])

		// Input/Button handlers
		async function handleDelete(id) {
			const confirmed = window.confirm("Tem certeza que deseja excluir este registro?");
			if (confirmed) {
				let msgType = "success";
					try {
						await api.delete(`/budget/${id}`);
						setBudgets(budgets.filter((budget) => budget._id !== id));
						setFlashMessage("Registro excluído com sucesso!", msgType);
					} catch (error) {
						msgType = "error";
						setFlashMessage(error.response.data.message, msgType);
					}
			}
		};

		async function handleGeneratePDF(){
			console.log(`Gerar PDF para o registro`);
		};

		async function handleFiltering(e){
			const {name, value} = e.target;

			if(name === 'searchTerm'){
				setSearchTerm(value);
			} else if(name === 'startDate'){
				setstartDateFilter(value);
			} else if(name === 'endDate'){
				setEndDateFilter(value);
			} else if(name === 'status'){
				console.log(`Filtrar por status: ${name} = ${value}`);
			}
		}

		async function searchBudgets() {
			console.log(`Buscar orçamentos com o termo: ${searchTerm}`);
		};

		return (
		<>
			<h1>Orçamentos</h1>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.headerSearchGroup}>
						<input 
							type="text"
							name="searchTerm"
							placeholder="Buscar orçamentos..."
							onChange={handleFiltering}
							className={styles.searchBar}
						/>
						<button className={styles.headerButton} onClick={() => searchBudgets()}>
							<MdSearch />
						</button>
					</div>
					<div className={styles.headerFilters}>
						Filtros:
						<select name="status" id="status" onChange={handleFiltering}>
							<option value="all">Todos</option>
							<option value="pending">Pendentes</option>
							<option value="approved">Aprovados</option>
						</select>
						<input
							type="date"
							name="startDate"
							placeholder="Data inicial"
							className={styles.dateInput}
						/>
						à
						<input
							type="date"
							name="endDate"
							placeholder="Data inicial"
							className={styles.dateInput}
						/>
						<button className={styles.headerButton}>
							Aplicar Filtros
						</button>
					</div>
					<Link to="/budget/create" className={styles.headerButton}>
						<MdOutlineAdd />
						Criar Orçamento
					</Link>
				</div>
				<div className={styles.table}>
					<div className={styles.tableHeader}>
						<span>Visão Geral</span>
						<span>Período do Projeto</span>
						<span>Status</span>
						<span>Ações</span>
					</div>
					{budgets.length > 0 ? (
						budgets.map((budget) => (
							<div key={budget._id} className={styles.tableRow}>
								<span className={styles.generalVision}>
									{budget.generalVision > 60 
										? budget.generalVision.slice(0, 60) + '...' 
										: budget.generalVision
									}
								</span>
								<span className={styles.dates}>
									{new Date(budget.startDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'})} 
									{" - "}
									{new Date(budget.endDate).toLocaleDateString('pt-BR',{timeZone: 'UTC'})}
								</span>
								<span className={budget.status === 'waiting' ? styles.waitingStatus : styles.approvedStatus}>
									{budget.status === 'waiting' ? 'Pendente' : 'Aprovado'}
								</span>
								<span className={styles.actions}>
									<Link to={`/budget/${budget._id}`} className={styles.button}>
										Ver
										<div className={styles.buttonIcon}><MdOutlineWysiwyg /></div>
									</Link>
									<Link to={`/budget/edit/${budget._id}`} className={styles.button}>
										Editar
										<div className={styles.buttonIcon}><MdEdit /></div>
									</Link>
									<button onClick={() => handleDelete(budget._id)} className={styles.button}>
										Excluir
										<div className={styles.buttonIcon}><MdDelete /></div>
									</button>
									<button onClick={() => handleGeneratePDF(budget._id)} className={styles.button}>
										Gerar PDF
										<div className={styles.buttonIcon}><MdPictureAsPdf /></div>
									</button>
								</span>
							</div>
						))
					) : (
						<p>Nenhum registro encontrado.</p>
					)}
				</div>
			</div>
		</>
	);
}

export default Budgets
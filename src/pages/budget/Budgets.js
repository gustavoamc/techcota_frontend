import api from '../../utils/api'
import styles from '../css/Budgets.module.css'
import useFlashMessage from '../../hooks/useFlashMessage'

import { useEffect, useState } from 'react'
import { MdSearch, MdOutlineAdd, MdOutlineWysiwyg, MdEdit, MdDelete, MdPictureAsPdf } from "react-icons/md";
import { Link } from 'react-router-dom'

/*TODO: 
- change to switch case if more than 2 status
- change remove confirmation window to modal
- adapt pdf button when it's ready
- implement ordering by clicking on column header
*/

// line 184-186 "toLocaleDateString" is using "UTC" to maintain the original date but adapt to local date format

function Budgets() {
		const [nonFilteredBudgets, setNonFilteredBudgets] = useState([])
		const [budgets, setBudgets] = useState([])
		const [searchTerm, setSearchTerm] = useState('')
		const [startDateFilter, setstartDateFilter] = useState('')
		const [endDateFilter, setEndDateFilter] = useState('')
		const [statusFilter, setStatusFilter] = useState('all')
		const [token] = useState(localStorage.getItem('token') || '')
		const { setFlashMessage } = useFlashMessage()

		useEffect(() => {
			api.get('/budget/all', {
				headers: {
					Authorization: `Bearer ${JSON.parse(token)}`
				}
			})
			.then((response) => {
				setNonFilteredBudgets(response.data.budgets)
				setBudgets(response.data.budgets)
			})
			.catch((error) => {
				setFlashMessage(error.response.data.message, 'error') //msg type
			})
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		// Input/Button handlers
		async function handleDelete(id) {
			const confirmed = window.confirm("Tem certeza que deseja excluir este registro?");
			if (confirmed) {
				let msgType = "success";
					try {
						await api.delete(`/budget/${id}`);
						setNonFilteredBudgets(budgets.filter((budget) => budget._id !== id));
						setBudgets(budgets.filter((budget) => budget._id !== id))
						setFlashMessage("Registro excluído com sucesso!", msgType);
					} catch (error) {
						msgType = "error";
						setFlashMessage(error.response.data.message, msgType);
					}
			}
		};

		async function handleGeneratePDF(id){
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
		};

		//set filters
		async function handleFiltering(e){
			const {name, value} = e.target;

			if(name === 'searchTerm'){
				setSearchTerm(value.trim());
			} else if(name === 'startDate'){
				setstartDateFilter(value);
			} else if(name === 'endDate'){
				setEndDateFilter(value);
			} else if(name === 'status'){
				setStatusFilter(value);
			}
		}

		function searchBudgets() {
			// \S checks if there is any non-whitespace character
			if(/\S/.test(searchTerm)) {
				
				//FIXME: searches after the first return based o the records of the first search - possible solution: create a budgetsBeforeSearch variable
				// filtering budgets, not non-filtered budgets, to include possible filters used
				setBudgets(budgets.filter((budget) => {
					return budget.generalVision.toLowerCase().includes(searchTerm.toLowerCase()) ||
					budget.proposal.toLowerCase().includes(searchTerm.toLowerCase())
				}))
			} else {
				applyFilters();
			}
		};

		function applyFilters() {
			setBudgets(nonFilteredBudgets.filter((budget) => {
				const budgetStartDate = new Date(budget.startDate).toISOString().split("T")[0];
  				const budgetEndDate = new Date(budget.endDate).toISOString().split("T")[0];

				// check start date (only filter if start date is not empty)
				return (!startDateFilter || budgetStartDate >= startDateFilter) &&
				// check end date (only filter if end date is not empty)
				(!endDateFilter || budgetEndDate <= endDateFilter) &&
				// check status (only filter if status is not "all")
				(statusFilter === "all" || budget.status === statusFilter)
			}));
		}

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
						<button className={styles.headerButton} onClick={searchBudgets}>
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
							onChange={handleFiltering}
							className={styles.dateInput}
						/>
						à
						<input
							type="date"
							name="endDate"
							onChange={handleFiltering}
							className={styles.dateInput}
						/>
						<button className={styles.headerButton} onClick={applyFilters}>
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
								<span className={budget.status === 'approved' ? styles.approvedStatus : styles.pendingStatus}>
									{budget.status === 'approved' ? 'Aprovado' : 'Pendente'}
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
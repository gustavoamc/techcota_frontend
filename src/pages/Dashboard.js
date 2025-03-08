import api from '../utils/api'
import useFlashMessage from '../hooks/useFlashMessage'
import LineChart from '../components/charts/LineChart'
import styles from './css/Dashboard.module.css'
import styles2 from './css/Budgets.module.css'



import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Link } from 'react-router-dom';
import { MdOutlineAdd } from "react-icons/md";

Chart.register(CategoryScale);

function Dashboard() {
    const [token] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage()
    const [budgetCount, setBudgetCount] = useState({
        totalApproved: 0,
        totalPending: 0
    })
    const [chartData, setChartData] = useState({
        labels: ['01/03', '02/03', '03/03'],
        datasets: [
            {
                label: "Orçamentos feitos",
                data: [0,0,0],
                backgroundColor: '#FFF',
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    })

    useEffect(() => {
        api.get('/budget/', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            if (!response.data || !Array.isArray(response.data.lastThreeMonthsCount)) {
                throw new Error("Dados inválidos da API");
            }
    
            setBudgetCount({
                totalApproved: response.data.totalApprovedBudgetsCount || 0,
                totalPending: response.data.totalPendingBudgetsCount || 0
            });
    
            setChartData({
                labels: response.data.lastThreeMonthsCount.map((reg) => reg.month || ""),
                datasets: [
                    {
                        label: "Orçamentos feitos",
                        data: response.data.lastThreeMonthsCount.map((reg) => reg.count || 0),
                        backgroundColor: '#000',
                        borderColor: "black",
                        borderWidth: 2,
                    },
                ],
            });
        }).catch((error) => {
            setFlashMessage(error.response.data.message ?? 'Erro ao buscar dados', 'error');
        });
    }, [token]);
    

    return (
        <div>
            <h1>Dashboard</h1>
            
            <div className={styles.mainDiv}>
                <div className={styles.chartContainer}>
                    <h3>Orçamentos nos últimos 3 meses</h3>
                    <LineChart chartData={chartData} />
                </div>
                <div className={styles.subMainContainer}>

                    <div>
                        <h2 className={styles.totalContainerTitle}>Total de orçamentos</h2>
                        <div className={styles.totalCounterContainer}>
                            <div className={styles.approvedContainer}>
                                <h3>Aprovados: {budgetCount.totalApproved}</h3>
                            </div>
                            <div className={styles.pendingContainer}>
                                <h3>Pendentes: {budgetCount.totalPending}</h3>
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttonsContainer}>
                        <h2 className={styles.totalContainerTitle}>Atalhos</h2>
                        <Link to="/budget/create" className={styles2.headerButton}>
                            <MdOutlineAdd />
                            Criar Orçamento
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
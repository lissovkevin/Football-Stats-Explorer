import { useEffect, useState } from "react";
import { Bar, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function GoalsPerLeague() {
    const [chartData, setChartData] = useState(null)

    const [loading, setLoading] = useState(true)

    return (
        <div>
            <h2>Goals Per League</h2>
        </div>
    )
}

export default GoalsPerLeague
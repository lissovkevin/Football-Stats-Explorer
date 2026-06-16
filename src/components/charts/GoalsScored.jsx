import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function GoalsScored() {
    const [chartData, setChartData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedLeague, setSelectedLeague] = useState('1')
    const [leagues, setLeagues] = useState([])

    useEffect(() => {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                query {
                    leagues {
                        id
                        name
                    }
                }
                `
            })
        })
        .then(res => res.json())
        .then(data => setLeagues(data.data.leagues))
    }, [])

    return (
        <div>
            <h2>Goals scored vs conceded</h2>
        </div>
    )
}
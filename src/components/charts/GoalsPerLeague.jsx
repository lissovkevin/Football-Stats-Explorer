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

    useEffect(() => {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query:`
                query {
                    matches(pageSize: 500, page: 1) {
                        homeGoals
                        awayGoals
                        league { name }
                    }
                }
                `
            })
        })
        .then(res => res.json())
        .then(data => {
            const macthes = data.data.matches

            const leagueGoals = matches.reduce((acc, match) => {
                const league = match.league.name

                if (!acc[league]) {
                    acc[league] = { totalGoals: 0, matchCount: 0 }
                }

                acc[league].totalGoals += (match.homeGoals ?? 0) + (match.awayGoals ?? 0)
                acc[league].matchCount += 1

                return acc
            }, {})

            const leagues = Object.keys(leagueGoals)
            const averages = leagues.map(league => {
                const { totalGoals, matchCount } = leagueGoals[league]
                return (totalGoals / matchCount).toFixed(2)
            })

            setChartData({
                labels: leagues,
                datasets: [
                    {
                        label: 'Average Goals per Match',
                        data: averages,
                        backgroundColor: 'rgba(22, 163, 74, 0.7)',
                        borderColor: 'rgba(22, 163, 74, 1)',
                        borderWidth: 1,
                    }
                ]
            })
            setLoading(false)
        })
    }, [])
    return (
        <div>
            <h2>Goals Per League</h2>
        </div>
    )
}

export default GoalsPerLeague
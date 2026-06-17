import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function WinsPerTeam() {
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
                `,
      }),
    })
      .then((res) => res.json())
      .then((data) => setLeagues(data.data.leagues))
  }, [])

  useEffect(() => {
    setLoading(true)

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        query {
          matches(pageSize: 500, page: 1, leagueId: ${selectedLeague}) {
            homeTeam { name }
            awayTeam { name }
            homeGoals
            awayGoals
          }
        }
      `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.data || !data.data.matches) {
          setLoading(false)
          return
        }

        const matches = data.data.matches

        const wins = matches.reduce((acc, match) => {
          const homeGoals = match.homeGoals ?? 0
          const awayGoals = match.awayGoals ?? 0

          if (homeGoals > awayGoals) {
            const team = match.homeTeam.name
            acc[team] = (acc[team] || 0) + 1
          }

          if (awayGoals > homeGoals) {
            const team = match.awayTeam.name
            acc[team] = (acc[team] || 0) + 1
          }

          return acc
        }, {})

        const sorted = Object.entries(wins)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)

        const teamNames = sorted.map((entry) => entry[0])
        const winCounts = sorted.map((entry) => entry[1])

        setChartData({
          labels: teamNames,
          datasets: [
            {
              label: 'Number of wins',
              data: winCounts,
              backgroundColor: 'rgba(22, 163, 74, 0.7)',
              borderColor: 'rgba(22, 163, 74, 1)',
              borderWidth: 1,
            },
          ],
        })

        setLoading(false)
      })
  }, [selectedLeague])

  if (loading) return <p className="text-gray-400">Loading chart...</p>

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Top 10 wins per team</h2>

      <div className="mb-4">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ height: '300px' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of wins',
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default WinsPerTeam

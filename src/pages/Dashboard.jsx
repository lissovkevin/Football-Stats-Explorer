import { useEffect, useState } from 'react'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function Dashboard() {
    const [leagues, setLeagues] = useState([])
    const [matches, setMatches] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const [selectedLeague, setSelectedLeague] = useState('')

    function fetchMatches(pageNumber, leagueName) {
        setLoading(true)

        const leagueFilter = leagueName ? `, league: "${leagueName}"` : ''

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                query {
                    matches(pageSize: 20, page: ${pageNumber}${leagueFilter}) {
                    id
                    date
                    homeTeam { name }
                    awayTeam { name }
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
                const newMatches = data.data.matches

                if (pageNumber === 1) {
                    setMatches(newMatches)
                } else {
                    setMatches(prev => [...prev, ...newMatches])
                }

                if (newMatches.length < 20) {
                    setHasMore(false)
                } else {
                    setHasMore(true)
                }

                setLoading(false)
            })
    }

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
                }`
            })
        })
            .then(res => res.json())
            .then(data => {
                setLeagues(data.data.leagues)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        fetchMatches(1, '')
    }, [])

    function handleLeagueChange(e) {
        const newLeague = e.target.value

        setSelectedLeague(newLeague)
        setPage(1)
        fetchMatches(1, newLeague)
    }

    function loadMore() {
        const nextPage = page + 1
        setPage(nextPage)
        fetchMacthes(nextPage, selectedLeague)
    }
    if (loading) return <p className='p-8'> Loading...</p>
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <ul>
                {leagues.map(league => (
                    <li key={league.id} className='py-1 text-gray-700'>
                        {league.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
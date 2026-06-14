import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function Dashboard() {
    const [leagues, setLeagues] = useState([])
    const [matches, setMatches] = useState([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)
    const [selectedLeague, setSelectedLeague] = useState('')
    const navigate = useNavigate()

    function fetchMatches(pageNumber, leagueName) {
        setLoading(true)

        const leagueFilter = leagueName ? `, leagueId: ${leagueName}` : ''

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

    function handleLoadMore() {
        const nextPage = page + 1
        setPage(nextPage)
        fetchMatches(nextPage, selectedLeague)
    }
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Matches</h1>
            <div className="mb-6">
                <select
                    value={selectedLeague}
                    onChange={handleLeagueChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs"
                >
                    <option value="">All leagues</option>

                    {leagues.map(league => (
                        <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-3">
                {matches.map(match => (
                    <div 
                    key={match.id} 
                    className="bg-white border border-gray-300 rounded-lg p-4"
                    onClick={() => navigate(`/match/${match.id}`)}
                    >
                        <div className="text-xs text-green-600 font-medium mb-2">
                            {match.league.name}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium w-1/3">{match.homeTeam.name}</span>
                            <div className='text-center'>
                                <div className="text-xl font-bold">
                                    {match.homeGoals ?? 0} — {match.awayGoals ?? 0}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{match.date}</div>
                            </div>
                            <span className="font-medium w-1/3 text-right">{match.awayTeam.name}</span>
                        </div>
                    </div>
                ))}
            </div>
            {loading && (
                <p className="text-center text-gray-400 mt-6">Loading matches...</p>
            )}
            {!loading && hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-medium"
                >
                    Load more matches
                </button>
            )}
            {!hasMore && (
                <p className="text-center text-gray-400 mt-6">All matches loaded!</p>
            )}
        </div>
    )
}

export default Dashboard
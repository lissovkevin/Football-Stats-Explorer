import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth'

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
                `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newMatches = data.data.matches

        if (pageNumber === 1) {
          setMatches(newMatches)
        } else {
          setMatches((prev) => [...prev, ...newMatches])
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
                }`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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
    setMatches([])
    fetchMatches(1, newLeague)
  }

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMatches(nextPage, selectedLeague)
  }
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Matches</h1>
          {isLoggedIn() && (
            <button
              onClick={() => navigate('/create-match')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
            >
              + Create match
            </button>
          )}
        </div>

        <div className="mb-6">
          <select
            value={selectedLeague}
            onChange={handleLeagueChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs bg-white"
          >
            <option value="">All leagues</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <div
              key={match.id}
              onClick={() => navigate(`/match/${match.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="text-xs text-green-600 font-medium mb-3 uppercase tracking-wide">
                {match.league.name}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800 w-1/3">
                  {match.homeTeam.name}
                </span>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {match.homeGoals ?? 0} — {match.awayGoals ?? 0}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{match.date}</div>
                </div>
                <span className="font-semibold text-gray-800 w-1/3 text-right">
                  {match.awayTeam.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center mt-8">
            <p className="text-gray-400">Loading matches...</p>
          </div>
        )}

        {!loading && hasMore && (
          <button
            onClick={handleLoadMore}
            className="mt-6 w-full bg-white border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:border-green-400 hover:text-green-600 transition-all"
          >
            Load more matches
          </button>
        )}

        {!hasMore && (
          <p className="text-center text-gray-400 mt-6">All matches loaded!</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard

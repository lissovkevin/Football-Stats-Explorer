import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function CreateMatch() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    homeTeamId: '',
    awayTeamId: '',
    homeGoals: 0,
    awayGoals: 0,
    leagueId: '',
    season: '',
  })
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
            query {
                leagues{
                    id
                    name
                }
            }
            `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLeagues(data.data.leagues)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!formData.leagueId) return

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
                query {
                    matches(pageSize: 100, page: 1, leagueId: ${formData.leagueId}) {
                        homeTeam { id name }
                        awayTeam { id name }
                    }
                }
                `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const matches = data.data.matches

        const teamMap = new Map()
        matches.forEach((match) => {
          teamMap.set(match.homeTeam.id, match.homeTeam)
          teamMap.set(match.awayTeam.id, match.awayTeam)
        })

        const uniqueTeams = Array.from(teamMap.values()).filter(
          (team) => team && team.name
        )
        const sortedTeams = uniqueTeams.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
        setTeams(uniqueTeams)
      })
  }, [formData.leagueId])

  async function handleSubmit() {
    const token = localStorage.getItem('jwt_token')

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
                    mutation {
                        createMatch(
                            date: "${formData.date}"
                            homeTeamId: ${formData.homeTeamId}
                            awayTeamId: ${formData.awayTeamId}
                            homeGoals: ${formData.homeGoals}
                            awayGoals: ${formData.awayGoals}
                            leagueId: ${formData.leagueId}
                            season: "${formData.season}"
                        ) {
                            id
                            date
                            homeTeam { name }
                            awayTeam { name }
                        }
                    }
                `,
      }),
    })

    const data = await response.json()

    if (data.data && data.data.createMatch) {
      alert('Match created successfully')
      navigate(`/match/${data.data.createMatch.id}`)
    } else {
      alert('Failed to create match. Please try again.')
      console.log(data.errors)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-green-600 mb-6 flex items-center gap-1 hover:text-green-700"
        >
          ← Back to matches
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create match</h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                League
              </label>
              <select
                value={formData.leagueId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leagueId: Number(e.target.value),
                    homeTeamId: '',
                    awayTeamId: '',
                  })
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white"
              >
                <option value="">Select a league</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>

            {teams.length > 0 && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Home team
                  </label>
                  <select
                    value={formData.homeTeamId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        homeTeamId: Number(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white"
                  >
                    <option value="">Select home team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Away team
                  </label>
                  <select
                    value={formData.awayTeamId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        awayTeamId: Number(e.target.value),
                      })
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white"
                  >
                    <option value="">Select away team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Home goals
                </label>
                <input
                  type="number"
                  value={formData.homeGoals}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeGoals: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Away goals
                </label>
                <input
                  type="number"
                  value={formData.awayGoals}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      awayGoals: Number(e.target.value),
                    })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Date (e.g. 31.12.2021)
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="DD.MM.YYYY"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Season (e.g. 22)
              </label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
                placeholder="22"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 mt-2"
            >
              Create match
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateMatch

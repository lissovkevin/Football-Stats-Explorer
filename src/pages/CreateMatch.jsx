import { use, useEffect, useEffectEvent, useState } from 'react'
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
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            query: `
            query {
                leagues{
                    id
                    name
                }
            }
            `
        })
    })
    .then(res => res.json())
    .then(data => {
        setLeagues(data.data.leagues)
        setLoading(false)
    })
  }, [])

    useEffect(() => {
        if (!formData.leagueId) return

        fetch(API_URL, {            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                query {
                    matches(pageSize: 100, page: 1, leagueId: ${formData.leagueId}) {
                        homeTeam { id name }
                        awayTeam { id name }
                    }
                }
                `
            })
        })
            .then(res => res.json())
            .then(data => {
                const matches = data.data.matches

                const teamMap = new Map()
                matches.forEach(match => {
                    teamMap.set(match.homeTeam.id, match.homeTeam)
                    teamMap.set(match.awayTeam.id, match.awayTeam)
                })

                const uniqueTeams = Array.from(teamMap.values())
                    .filter(team => team && team.name)
                    console.log('After filter ', uniqueTeams.length)
                    const sortedTeams = uniqueTeams.sort((a, b) => a.name.localeCompare(b.name))
                setTeams(uniqueTeams)
            })
    }, [formData.leagueId])

    async function handleSubmit() {
        const token = localStorage.getItem('jwt_token')

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
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
                `
            })
        })

        const data = await response.json()

        if (data.data && data.data.CreateMatch) {
            alert('Match created successfully')
            navigate(`/match/${data.data.createMatch.id}`)
        } else {
            alert('Failed to create match. Please try again.')
            console.log(data.errors)
        }
    }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create match</h1>
    </div>
  )
}

export default CreateMatch
import { use, useEffect, useState } from 'react'
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create match</h1>
    </div>
  )
}

export default CreateMatch
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function MatchDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                query: `
                query {
                    match(id: ${id}) {
                        id
                        date
                        season
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
            setMatch(data.data.match)
            setLoading(false)
        })
    }, [id])

    if (loading) return <p className="p-8">Loading...</p>
    if (!match) return <p className="p-8">Match not found.</p>

    return (
    <div className="p-8 max-w-xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-green-600 mb-6 flex items-center gap-1"
      >
        ← Back to matches
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="text-xs text-green-600 font-medium mb-4">
          {match.league.name}
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg w-1/3">{match.homeTeam.name}</span>
          <div className="text-center">
            <div className="text-4xl font-bold">
              {match.homeGoals ?? 0} — {match.awayGoals ?? 0}
            </div>
          </div>
          <span className="font-bold text-lg w-1/3 text-right">{match.awayTeam.name}</span>
        </div>
        <div className="text-sm text-gray-500 text-center mb-6">
          <p>Date: {match.date}</p>
          <p>Season: {match.season}</p>
        </div>
        {isLoggedIn() && (
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
              Edit match
            </button>
            <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
              Delete match
            </button>
          </div>
        )}
      </div>
    </div>
    )
}

export default MatchDetail

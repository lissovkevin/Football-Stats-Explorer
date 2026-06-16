import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function MatchDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [editData, setEditData] = useState({
        homeGoals: 0,
        awayGoals: 0,
        date: '',
    })

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

    async function handleDelete() {
      const confirmed = window.confirm('Are you sure you want to delete this match?')
      if (!confirmed) return

        const token = localStorage.getItem('jwt_token')

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              mutation {
                deleteMatch(id: ${id}) {
                  success
                  message
                }
              }
            `
          })
        })

        const data = await response.json()

        if (data.data && data.data.deleteMatch.success) {
          alert('Match deleted successfully')
          navigate('/dashboard')
        } else {
          alert('Failed to delete match. Please try again.')
        }
    }

    function handleEdit() {
      setEditData({
        homeGoals: match.homeGoals ?? 0,
        awayGoals: match.awayGoals ?? 0,
        date: match.date
      })
      setEditing(true)
    }

    async function handleUpdate(){
      const token = localStorage.getItem('jwt_token')

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateMatch(
                id: ${id},
                homeGoals: ${editData.homeGoals},
                awayGoals: ${editData.awayGoals},
                date: "${editData.date}"
              ) {
                id
                homeGoals
                awayGoals
                date
                }
            }
          `
        })
      })

      const data = await response.json()

      if (data.data && data.data.updateMatch) {
        setMatch(data.data.updateMatch)
        setEditing(false)
        alert('Match updated successfully')
        window.location.reload()
      } else {
        alert('Failed to update match. Please try again.')
      }
    }

    if (loading) return <p className="p-8">Loading...</p>
    if (!match) return <p className="p-8">Match not found.</p>

return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-green-600 mb-6 flex items-center gap-1 hover:text-green-700">
          ← Back to matches
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">

          <div className="text-xs text-green-600 font-medium mb-6 uppercase tracking-wide">
            {match.league.name}
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-xl text-gray-800 w-1/3">
              {match.homeTeam.name}
            </span>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800">
                {match.homeGoals ?? 0} — {match.awayGoals ?? 0}
              </div>
            </div>
            <span className="font-bold text-xl text-gray-800 w-1/3 text-right">
              {match.awayTeam.name}
            </span>
          </div>

          <div className="flex justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Date</div>
              <div className="font-medium text-gray-700">{match.date}</div>
            </div>
            <div className="text-center">
              <div className="text-xs uppercase tracking-wide mb-1">Season</div>
              <div className="font-medium text-gray-700">{match.season}</div>
            </div>
          </div>
  
          {isLoggedIn() && (
            <div className="mt-6">
              {editing ? (
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-lg">Edit match</h3>

                  <div>
                    <label className="text-sm text-gray-500">
                      {match.homeTeam.name} goals
                    </label>
                    <input
                      type="number"
                      value={editData.homeGoals}
                      onChange={e => setEditData({ ...editData, homeGoals: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      {match.awayTeam.name} goals
                    </label>
                    <input
                      type="number"
                      value={editData.awayGoals}
                      onChange={e => setEditData({ ...editData, awayGoals: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Date</label>
                    <input
                      type="text"
                      value={editData.date}
                      onChange={e => setEditData({ ...editData, date: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full mt-1"
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button onClick={handleUpdate} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Save changes
                    </button>
                    <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={handleEdit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Edit match
                  </button>
                  <button onClick={handleDelete}className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                    Delete match
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchDetail

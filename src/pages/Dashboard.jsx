import { useEffect, useState } from 'react'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function Dashboard() {
    const [leagues, setLeagues] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
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
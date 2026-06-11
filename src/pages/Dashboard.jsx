import { useEffect, useState } from 'react'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <ul>
                <li key = {leagues.id}>
                    {leagues.name}
                </li>
            </ul>
        </div>
    )
}

export default Dashboard
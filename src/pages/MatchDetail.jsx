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
    })

    return (
        <div className="p-8">
            <h1>Match detail</h1>
        </div>
    )
}

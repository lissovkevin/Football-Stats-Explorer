import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function MatchDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(true)

    return (
        <div className="p-8">
            <h1>Match detail</h1>
        </div>
    )
}

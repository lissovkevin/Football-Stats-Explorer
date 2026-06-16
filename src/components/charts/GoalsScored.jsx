import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function GoalsScored() {
    return (
        <div>
            <h2>Goals scored vs conceded</h2>
        </div>
    )
}
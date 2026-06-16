import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function CreateMatch() {
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create match</h1>
    </div>
  )
}

export default CreateMatch
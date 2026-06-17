import GoalsPerLeague from '../components/charts/GoalsPerLeague'
import WinsPerTeam from '../components/charts/WinsPerTeam'
import GoalsScored from '../components/charts/GoalsScored'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-green-600 text-white px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Football Stats Explorer</h1>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Explore match results, goals, and team performance across 18 European
          leagues.
        </p>
        <Link
          to="/dashboard"
          className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50"
        >
          Browse matches →
        </Link>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-8">
        <h2 className="text-2xl font-bold text-gray-800">League statistics</h2>
        <GoalsPerLeague />
        <WinsPerTeam />
        <GoalsScored />
      </div>
    </div>
  )
}

export default Home

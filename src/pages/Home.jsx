import GoalsPerLeague from '../components/charts/GoalsPerLeague'

function Home() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Football Stats Explorer</h1>
            <p className="text-gray-500 mb-8">Explore match results, goals, and team performance across 18 European leagues.</p>
            {/* Charts section */}
            <div className="flex flex-col gap-8">
                <GoalsPerLeague />
            </div>
        </div>
    )
}

export default Home
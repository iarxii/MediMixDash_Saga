import { useAppSelector } from "../store/hooks";

function Statistics() {
  const game = useAppSelector((state) => state.game);

  const completionRate = game.statistics.totalPatients > 0
    ? ((game.statistics.completedPatients / game.statistics.totalPatients) * 100).toFixed(1)
    : "0.0";

  const failureRate = game.statistics.totalPatients > 0
    ? ((game.statistics.failedPatients / game.statistics.totalPatients) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl shadow-lg border border-green-200">
      <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
        <span className="text-2xl mr-2">📊</span>
        Pharmacy Statistics
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Score & Currency */}
        <div className="bg-white p-3 rounded-lg shadow-sm border col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Dash Points</div>
              <div className="text-2xl font-bold text-green-600">{game.dashPoints}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">MediCred</div>
              <div className="text-xl font-bold text-blue-600">🪙{game.currency}</div>
            </div>
          </div>
        </div>

        {/* Patient Statistics */}
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{game.statistics.totalPatients}</div>
            <div className="text-xs text-gray-600">Total Patients</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{game.statistics.completedPatients}</div>
            <div className="text-xs text-gray-600">Completed</div>
            <div className="text-xs text-green-700">{completionRate}%</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{game.statistics.failedPatients}</div>
            <div className="text-xs text-gray-600">Failed</div>
            <div className="text-xs text-red-700">{failureRate}%</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{game.statistics.averageWaitTime.toFixed(1)}s</div>
            <div className="text-xs text-gray-600">Avg Wait Time</div>
          </div>
        </div>

        {/* Satisfaction Metrics */}
        <div className="bg-white p-3 rounded-lg shadow-sm border col-span-2">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{game.compliments}</div>
              <div className="text-xs text-gray-600">Compliments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{game.complaints}</div>
              <div className="text-xs text-gray-600">Complaints</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{game.morale}%</div>
              <div className="text-xs text-gray-600">Morale</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
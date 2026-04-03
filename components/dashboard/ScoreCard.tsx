export default function ScoreCard() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-sm flex justify-between items-center">

      <div>
        <p className="text-sm text-gray-600">Current Standing</p>

        <h2 className="text-2xl font-semibold mt-1">
          Job-ready for Backend Engineer
        </h2>

        <p className="text-blue-600 font-medium mt-2">
          82 / 100
        </p>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          View Career Roadmap
        </button>
      </div>

      {/* SCORE CIRCLE (simple version) */}
      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
        82
      </div>

    </div>
  );
}
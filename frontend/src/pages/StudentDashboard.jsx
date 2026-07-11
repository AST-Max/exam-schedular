import { useState, useEffect } from 'react'
import API from '../api/axios'

function StudentDashboard() {
  const [subjects, setSubjects] = useState([])
  const [selected, setSelected] = useState([])
  const [timetable, setTimetable] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
    fetchTimetable()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects/all')
      setSubjects(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchTimetable = async () => {
    try {
      const res = await API.get('/timetable/latest')
      setTimetable(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const toggleSubject = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectSubjects = async () => {
    setLoading(true)
    try {
      await API.post('/subjects/select', { subjectIds: selected })
      setMessage('Subjects saved successfully!')
    } catch (err) {
      setMessage('Failed to save subjects')
    }
    setLoading(false)
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  const slotColors = ['emerald', 'blue', 'purple', 'orange', 'pink']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 p-6">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-emerald-500 p-3 rounded-xl mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
              <p className="text-gray-400 text-sm">Select subjects & view timetable</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-red-500 border border-gray-700 hover:border-red-500 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-emerald-500 bg-opacity-10 border border-emerald-500 border-opacity-30 text-emerald-400 p-3 rounded-xl mb-6 text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Select Subjects */}
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Select Subjects
            </h2>
            <p className="text-gray-400 text-xs mb-4">Click to select your enrolled subjects</p>
            <div className="space-y-2 mb-4">
              {subjects.map((sub) => (
                <div
                  key={sub._id}
                  onClick={() => toggleSubject(sub._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition duration-200 border ${
                    selected.includes(sub._id)
                      ? 'bg-emerald-500 bg-opacity-20 border-emerald-500 border-opacity-50'
                      : 'bg-gray-700 bg-opacity-50 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    selected.includes(sub._id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500'
                  }`}>
                    {selected.includes(sub._id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-emerald-400 text-xs font-bold">{sub.code}</span>
                  <span className="text-gray-300 text-sm">{sub.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={selectSubjects}
              disabled={loading || selected.length === 0}
              className="w-full p-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : `Save ${selected.length} Subject(s)`}
            </button>
          </div>

          {/* Timetable */}
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-purple-500 bg-opacity-20 text-purple-400 p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              Exam Timetable
            </h2>
            {timetable ? (
              <div className="space-y-2">
                {timetable.slots.map((slot) => (
                  <div key={slot._id} className="flex items-center gap-3 p-3 bg-gray-700 bg-opacity-50 rounded-xl border border-gray-600">
                    <div className={`bg-${slotColors[(slot.timeSlot - 1) % slotColors.length]}-500 bg-opacity-20 px-3 py-1 rounded-lg`}>
                      <span className={`text-${slotColors[(slot.timeSlot - 1) % slotColors.length]}-400 text-xs font-bold`}>
                        Slot {slot.timeSlot}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm">{slot.subjectName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-sm">No timetable available yet</p>
                <p className="text-gray-600 text-xs mt-1">Ask admin to generate one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
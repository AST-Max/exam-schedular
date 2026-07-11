import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import API from '../api/axios'

function AdminDashboard() {
  const [subjects, setSubjects] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [timetable, setTimetable] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await API.get('/subjects/all')
      setSubjects(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const addSubject = async () => {
    setLoading(true)
    try {
      await API.post('/subjects/add', { name, code })
      setMessage('Subject added successfully!')
      setName('')
      setCode('')
      fetchSubjects()
    } catch (err) {
      setMessage('Failed to add subject')
    }
    setLoading(false)
  }

  const generateTimetable = async () => {
    setLoading(true)
    try {
      const res = await API.post('/timetable/generate')
      setTimetable(res.data.timetable)
      setMessage('Timetable generated successfully!')
    } catch (err) {
      setMessage('Failed to generate timetable')
    }
    setLoading(false)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFillColor(17, 24, 39)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setTextColor(52, 211, 153)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Exam Scheduler', 105, 20, { align: 'center' })

    doc.setTextColor(156, 163, 175)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated Timetable', 105, 30, { align: 'center' })
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' })

    doc.setDrawColor(52, 211, 153)
    doc.line(20, 44, 190, 44)

    let y = 55
    timetable.slots.forEach((slot, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(31, 41, 55)
        doc.rect(20, y - 6, 170, 12, 'F')
      }
      doc.setTextColor(52, 211, 153)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(`Slot ${slot.timeSlot}`, 30, y)

      doc.setTextColor(229, 231, 235)
      doc.setFont('helvetica', 'normal')
      doc.text(slot.subjectName, 80, y)

      y += 14
    })

    doc.save('exam-timetable.pdf')
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  const slotColors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 p-6">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-emerald-500 p-3 rounded-xl mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage subjects & timetables</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Add Subject */}
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add Subject
            </h2>
            <div className="mb-3">
              <label className="text-gray-400 text-sm mb-1 block">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Mathematics"
                className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-emerald-500 focus:outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Subject Code</label>
              <input
                type="text"
                placeholder="e.g. MATH101"
                className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-emerald-500 focus:outline-none transition"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button
              onClick={addSubject}
              disabled={loading}
              className="w-full p-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50"
            >
              Add Subject
            </button>
          </div>

          {/* Subjects List */}
          <div className="bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-blue-500 bg-opacity-20 text-blue-400 p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              All Subjects ({subjects.length})
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {subjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No subjects added yet</p>
              ) : (
                subjects.map((sub, index) => (
                  <div key={sub._id} className="flex items-center gap-3 p-3 bg-gray-700 bg-opacity-50 rounded-xl">
                    <span className={`${slotColors[index % slotColors.length]} bg-opacity-20 text-xs font-bold px-2 py-1 rounded-lg ${slotColors[index % slotColors.length].replace('bg-', 'text-')}`}>
                      {sub.code}
                    </span>
                    <span className="text-gray-300 text-sm">{sub.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Generate Timetable */}
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="bg-purple-500 bg-opacity-20 text-purple-400 p-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Generate Timetable
            </h2>
            <div className="flex gap-2">
              <button
                onClick={generateTimetable}
                disabled={loading}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
              {timetable && (
                <button
                  onClick={downloadPDF}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {timetable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {timetable.slots.map((slot) => (
                <div key={slot._id} className="bg-gray-700 bg-opacity-50 border border-gray-600 p-4 rounded-xl">
                  <div className={`${slotColors[(slot.timeSlot - 1) % slotColors.length]} bg-opacity-20 inline-block px-3 py-1 rounded-lg mb-2`}>
                    <span className={`text-xs font-bold ${slotColors[(slot.timeSlot - 1) % slotColors.length].replace('bg-', 'text-')}`}>
                      Slot {slot.timeSlot}
                    </span>
                  </div>
                  <p className="text-white font-medium">{slot.subjectName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No timetable generated yet. Add subjects first then click Generate.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
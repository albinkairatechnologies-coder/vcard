import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, QrCode, Pencil, TrendingUp, ExternalLink, Sparkles, Trash2 } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import CardPreview from '../components/CardPreview'
import QRModal from '../components/QRModal'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [card, setCard] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardRes = await api.get('/cards')
        const c = cardRes.data.card
        setCard(c)
        const analyticsRes = await api.get(`/analytics/${c.id}`)
        setAnalytics(analyticsRes.data)
      } catch (err) {
        if (err.response?.status !== 404) console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const publicUrl = `${window.location.origin}/card/${user.slug}`

  const handleDeleteCard = async () => {
    if (!card?.id) return
    if (!confirm('Delete this card permanently? This action cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/cards/${card.id}`)
      setCard(null)
      setAnalytics(null)
      localStorage.removeItem('smartcard_editor')
      alert('Card deleted successfully.')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete card.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your card…</p>
          </div>
        </div>
      </>
    )
  }

  const maxViews = analytics ? Math.max(...analytics.last_7_days.map(x => x.views), 1) : 1

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hey, <span className="gradient-text">{user.name?.split(' ')[0]}</span> 👋
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-400">Your card:</span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {publicUrl} <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            {card && (
              <button
                onClick={() => setShowQR(true)}
                className="btn-secondary"
              >
                <QrCode size={16} /> QR Code
              </button>
            )}
            {card && (
              <button onClick={handleDeleteCard} disabled={deleting} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 size={16} /> {deleting ? 'Deleting...' : 'Delete Card'}
              </button>
            )}
            <Link to="/editor" className="btn-primary">
              <Pencil size={16} /> {card ? 'Edit Card' : 'Create Card'}
            </Link>
          </div>
        </div>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Total views */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Eye size={18} className="text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Total views</span>
                </div>
                <span className="text-xs text-green-500 font-medium bg-green-50 px-2 py-0.5 rounded-full">All time</span>
              </div>
              <p className="text-4xl font-bold gradient-text">{analytics.total_views}</p>
            </div>

            {/* Last 7 days chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <TrendingUp size={18} className="text-purple-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Last 7 days</span>
              </div>
              <div className="flex items-end gap-1.5 h-14">
                {analytics.last_7_days.map((d, i) => {
                  const pct = Math.round((d.views / maxViews) * 100)
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.date}: ${d.views} views`}>
                      <div
                        className="w-full rounded-t-md transition-all duration-500 bg-gradient-to-t from-indigo-500 to-purple-400 opacity-80 group-hover:opacity-100"
                        style={{ height: `${Math.max(pct, 6)}%`, animationDelay: `${i * 0.05}s` }}
                      />
                      <span className="text-[9px] text-gray-300">{d.date?.slice(5)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Card preview or empty state */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {card ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 card-shadow">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Card preview</h2>
                <Link to="/editor" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  <Pencil size={12} /> Edit
                </Link>
              </div>
              <CardPreview card={{ ...card, name: card.name || user.name, email: card.email || user.email }} />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200 rounded-2xl p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Create your digital card</h3>
              <p className="text-gray-500 text-sm mb-6">Share your contact info with a beautiful, shareable link.</p>
              <Link to="/editor" className="btn-primary">
                <Pencil size={16} /> Create your card
              </Link>
            </div>
          )}
        </div>
      </main>

      {showQR && <QRModal slug={user.slug} onClose={() => setShowQR(false)} />}
    </>
  )
}

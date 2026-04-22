import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon, Share2, Download } from 'lucide-react'
import api from '../api/axios'

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeNiaF_qV0h8GoMSq90Guhwu2PbStUx_M942fQnPtKw0mPRKhej89A1fvjXQEp2U_u/exec'

const ICON_MAP = {
  email: <Mail size={16} />, phone: <Phone size={16} />, companyUrl: <Globe size={16} />,
  address: <MapPin size={16} />, twitter: <AtSign size={16} />, instagram: <AtSign size={16} />,
  threads: <AtSign size={16} />, linkedin: <AtSign size={16} />, facebook: <AtSign size={16} />,
  youtube: <AtSign size={16} />, snapchat: <AtSign size={16} />, tiktok: <AtSign size={16} />,
  twitch: <AtSign size={16} />, yelp: <AtSign size={16} />, whatsapp: <MessageCircle size={16} />,
  signal: <MessageCircle size={16} />, discord: <MessageCircle size={16} />,
  skype: <MessageCircle size={16} />, telegram: <MessageCircle size={16} />,
  github: <GitBranch size={16} />, calendly: <Calendar size={16} />, customLink: <LinkIcon size={16} />,
}

export default function EditorPublicCard() {
  const { slug } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' })
  const [sendingLead, setSendingLead] = useState(false)

  useEffect(() => {
    api.get(`/cards/public/${slug}`)
      .then((res) => setCard(res.data.card))
      .catch(() => setCard(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-3">🪪</p>
          <h1 className="text-xl font-bold text-gray-800">Card not available</h1>
          <p className="text-sm text-gray-500 mt-1">This slug is not published yet or card is inactive.</p>
        </div>
      </div>
    )
  }

  const metaByType = (type) => (Array.isArray(card.links) ? card.links.find((l) => l.type === type)?.url || '' : '')
  const displayName = metaByType('meta_name') || card.name || 'Your Name'
  const displayEmail = metaByType('meta_email') || card.email || ''
  const displayCompany = metaByType('meta_company') || card.company || ''
  const displayTitle = card.title || ''
  const displayBio = card.bio || ''
  const department = metaByType('meta_department')
  const accreditations = metaByType('meta_accreditations')
  const address = metaByType('meta_address')
  const leadSource = metaByType('meta_leadSource')
  const leadTags = metaByType('meta_leadTags')
  const followUpDate = metaByType('meta_followUpDate')
  const ctaLabel = metaByType('meta_ctaLabel')
  const themeColor = metaByType('meta_themeColor') || card.theme || '#6366f1'
  
  const vBgEnabled = metaByType('meta_vBg_enabled') === 'true'
  const vBgPreset = metaByType('meta_vBg_preset') || ''
  const vBgCustomFile = metaByType('meta_vBg_custom') || ''
  const uploadsBase = `${window.location.protocol}//${window.location.hostname}/smartcard/backend/uploads/`

  const bgStyle = vBgEnabled
    ? vBgCustomFile
      ? { backgroundImage: `url(${uploadsBase}${vBgCustomFile})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: vBgPreset ? `linear-gradient(135deg, ${vBgPreset})` : '#f3f4f6' }
    : { background: '#f3f4f6' }

  const fields = [
    displayEmail && { key: 'email', label: 'Email', value: displayEmail, href: `mailto:${displayEmail}` },
    address && { key: 'address', label: 'Address', value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}` },
    ...(Array.isArray(card.links) ? card.links.filter((link) => !String(link.type || '').startsWith('meta_')).map((link) => ({
      key: link.type || 'customLink',
      label: link.label || 'Link',
      value: link.url,
      href: link.url.startsWith('http') || link.url.startsWith('mailto') || link.url.startsWith('tel') ? link.url : `https://${link.url}`,
    })) : []),
  ].filter(Boolean)

  const profileFile = metaByType('meta_profile')
  const coverFile = metaByType('meta_cover')
  const logoFile = metaByType('meta_logo')
  const profilePhotoUrl = profileFile ? `${uploadsBase}${profileFile}` : (card.photo ? `${uploadsBase}${card.photo}` : '')
  const coverPhotoUrl = coverFile ? `${uploadsBase}${coverFile}` : ''
  const logoUrl = logoFile ? `${uploadsBase}${logoFile}` : ''

  const saveVCF = async () => {
    const phone = Array.isArray(card.links) ? card.links.find((l) => l.type === 'phone')?.url || '' : ''
    const website = Array.isArray(card.links) ? card.links.find((l) => l.type === 'website')?.url || '' : ''

    // Try native Contact Picker API (Android Chrome only)
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        await navigator.contacts.select(['name', 'email', 'tel'], { multiple: false })
        // API only reads, not writes — fall through to vcf
      } catch {}
    }

    // Use Web Share API with vcf file (best for iOS + Android)
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${displayName || 'Contact'}`,
      `N:${displayName || 'Contact'};;;;`,
      displayCompany ? `ORG:${displayCompany}` : '',
      card.title     ? `TITLE:${card.title}`   : '',
      phone          ? `TEL;TYPE=CELL:${phone}` : '',
      displayEmail   ? `EMAIL;TYPE=INTERNET:${displayEmail}` : '',
      website        ? `URL:${website}` : '',
      'END:VCARD',
    ].filter(Boolean)

    const vcfContent = lines.join('\r\n') + '\r\n'
    const blob = new Blob([vcfContent], { type: 'text/vcard' })
    const file = new File([blob], `${(displayName || 'contact').replace(/\s+/g, '-').toLowerCase()}.vcf`, { type: 'text/vcard' })

    // Try Web Share with file (Android Chrome — opens native contact import directly)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: displayName })
        return
      } catch {}
    }

    // Fallback: direct download (iOS Safari, desktop)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareCard = async () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: displayName || 'Digital Card', text: card.bio || 'Connect with me', url }).catch(() => {})
      return
    }
    navigator.clipboard.writeText(url).catch(() => {})
    alert('Link copied to clipboard!')
  }

  const submitLead = async (e) => {
    e.preventDefault()
    setSendingLead(true)
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ slug, name: lead.name, email: lead.email, mobile: lead.phone, message: lead.note }),
      })
      alert('Thanks! Your details were shared successfully.')
      setLead({ name: '', email: '', phone: '', note: '' })
    } catch {
      alert('Failed to submit your details.')
    } finally {
      setSendingLead(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden" style={bgStyle}>
        {/* Cover */}
        {coverPhotoUrl && (
          <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${coverPhotoUrl})` }} />
        )}

        {/* Profile + Logo */}
        <div className="relative px-6 pt-6 pb-4">
          {logoUrl && (
            <img src={logoUrl} alt="logo" className="absolute top-4 right-4 w-12 h-12 object-contain rounded-lg bg-white/80 p-1" />
          )}
          {profilePhotoUrl ? (
            <img src={profilePhotoUrl} alt={displayName} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold" style={{ background: themeColor, color: '#fff' }}>
              {displayName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-6 pb-6 space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            {displayTitle && <p className="text-sm text-gray-600 mt-0.5">{displayTitle}</p>}
            {department && <p className="text-xs text-gray-400">{department}</p>}
            {displayCompany && <p className="text-sm font-medium text-gray-700 mt-1">{displayCompany}</p>}
            {accreditations && (
              <div className="flex flex-wrap gap-1 mt-2">
                {accreditations.split(',').map((a, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${themeColor}20`, color: themeColor }}>
                    {a.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {displayBio && (
            <p className="text-sm text-gray-500 leading-relaxed">{displayBio}</p>
          )}

          {/* Fields */}
          {fields.length > 0 && (
            <div className="space-y-2 pt-2">
              {fields.map((f, i) => {
                const row = (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: `${themeColor}10` }}>
                    <span style={{ color: themeColor }}>{ICON_MAP[f.key] || <LinkIcon size={16} />}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="text-sm text-gray-700 truncate">{f.value}</p>
                    </div>
                  </div>
                )
                return f.href ? <a key={f.key} href={f.href} target="_blank" rel="noreferrer" className="block">{row}</a> : <div key={f.key}>{row}</div>
              })}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-2 pt-3">
            <button onClick={shareCard} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: themeColor }}>
              Share
            </button>
            <button onClick={saveVCF} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all text-center" style={{ borderColor: themeColor, color: themeColor }}>
              {ctaLabel || 'Save Contact'}
            </button>
          </div>

          <form onSubmit={submitLead} className="mt-5 border border-gray-100 rounded-2xl p-3 space-y-2 bg-white/80">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Share your details</p>
            <input className="input-field text-sm" placeholder="Your name" value={lead.name} onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field text-sm" placeholder="Email" type="email" value={lead.email} onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))} />
              <input className="input-field text-sm" placeholder="Phone" value={lead.phone} onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <textarea className="input-field text-sm resize-none" rows={2} placeholder="Context or note" value={lead.note} onChange={(e) => setLead((p) => ({ ...p, note: e.target.value }))} />
            <button type="submit" disabled={sendingLead} className="w-full text-sm font-semibold border-2 py-2.5 rounded-xl transition-all" style={{ borderColor: themeColor, color: themeColor }}>
              {sendingLead ? 'Submitting...' : 'Submit Contact'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

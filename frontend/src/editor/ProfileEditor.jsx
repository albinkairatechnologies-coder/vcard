import { useEffect, useRef, useState } from 'react'
import { User, Globe, AtSign, MessageCircle, Briefcase, Download, Share2, RotateCcw, Eye, EyeOff, Upload, FileJson, Sparkles, Target } from 'lucide-react'
import html2canvas from 'html2canvas'
import { useCardStore } from './useCardStore'
import CardPreview from './CardPreview'
import VisualPanel from './VisualPanel'
import Section from './Section'
import Navbar from '../components/Navbar'
import api from '../api/axios'

function Field({ label, name, value, onChange, type = 'text', placeholder, maxLength }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        className="input-field text-sm"
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        maxLength={maxLength}
      />
    </div>
  )
}

function TextareaField({ label, name, value, onChange, placeholder, maxLength }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label} {maxLength && <span className="text-gray-300">({value.length}/{maxLength})</span>}
      </label>
      <textarea
        className="input-field text-sm resize-none"
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        maxLength={maxLength}
      />
    </div>
  )
}

export default function ProfileEditor() {
  const { card, update, setAll, updateNested, addCustomField, removeCustomField, updateCustomField, reorderCustomFields } = useCardStore()
  const previewRef = useRef()
  const importRef = useRef()
  const [previewVisible, setPreviewVisible] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverCardId, setServerCardId] = useState(null)

  const completionFields = ['name', 'jobTitle', 'companyName', 'email', 'phone', 'headline', 'linkedin']
  const completed = completionFields.filter((key) => (card[key] || '').trim()).length
  const completionPct = Math.round((completed / completionFields.length) * 100)

  const presets = [
    {
      id: 'sales',
      label: 'Sales Pro',
      data: {
        jobTitle: 'Sales Director',
        headline: 'Helping teams increase pipeline through smarter event networking.',
        ctaLabel: 'Save Contact',
        leadSource: 'Conference Booth',
      },
    },
    {
      id: 'founder',
      label: 'Founder',
      data: {
        jobTitle: 'Founder',
        headline: 'Building products that turn first conversations into lasting customers.',
        ctaLabel: 'Save Contact',
        leadSource: 'Warm Referral',
      },
    },
    {
      id: 'consultant',
      label: 'Consultant',
      data: {
        jobTitle: 'Business Consultant',
        headline: 'Strategy, systems, and execution support for scaling teams.',
        ctaLabel: 'Save Contact',
        leadSource: 'LinkedIn',
      },
    },
  ]

  const applyCardPayload = (payload) => {
    const safeLinks = Array.isArray(payload.links) ? payload.links : []
    const linkByType = (type) => safeLinks.find((l) => l.type === type)?.url || ''
    const metaByType = (type) => safeLinks.find((l) => l.type === type)?.url || ''
    const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'
    const uploadsBase = `${baseUrl}/uploads/`
    const profileFile = safeLinks.find((l) => l.type === 'meta_profile')?.url || payload.photo || ''
    const coverFile   = safeLinks.find((l) => l.type === 'meta_cover')?.url || ''
    const logoFile    = safeLinks.find((l) => l.type === 'meta_logo')?.url || ''
    const vBgFile     = safeLinks.find((l) => l.type === 'meta_vBg_custom')?.url || ''
    const social      = ['twitter', 'instagram', 'threads', 'linkedin', 'facebook', 'youtube', 'snapchat', 'tiktok', 'twitch', 'yelp']
    const messaging   = ['whatsapp', 'signal', 'discord', 'skype', 'telegram']
    const business    = ['github', 'calendly']

    const socialData = {}
    social.forEach(key => { socialData[key] = linkByType(key) })
    messaging.forEach(key => { socialData[key] = linkByType(key) })
    business.forEach(key => { socialData[key] = linkByType(key) })

    // Single batch update -- one localStorage save with ALL fields including images
    // Ensure server URLs are properly constructed and saved
    const cardData = {
      name:           metaByType('meta_name')           || payload.name    || '',
      jobTitle:       payload.title                     || '',
      department:     metaByType('meta_department')     || '',
      accreditations: metaByType('meta_accreditations') || '',
      companyName:    metaByType('meta_company')        || payload.company || '',
      headline:       payload.bio                       || '',
      profilePhoto:   profileFile ? `${uploadsBase}${profileFile}` : '',
      coverPhoto:     coverFile   ? `${uploadsBase}${coverFile}`   : '',
      companyLogo:    logoFile    ? `${uploadsBase}${logoFile}`    : '',
      email:          metaByType('meta_email')          || payload.email   || '',
      phone:          linkByType('phone'),
      companyUrl:     linkByType('website'),
      customLinkLabel: safeLinks.find((l) => l.type === 'custom')?.label || '',
      customLink:     linkByType('custom'),
      address:        metaByType('meta_address')        || '',
      leadSource:     metaByType('meta_leadSource')     || '',
      leadTags:       metaByType('meta_leadTags')       || '',
      followUpDate:   metaByType('meta_followUpDate')   || '',
      meetingNote:    metaByType('meta_meetingNote')    || '',
      ctaLabel:       metaByType('meta_ctaLabel')       || '',
      ctaUrl:         metaByType('meta_ctaUrl')         || '',
      themeColor:     metaByType('meta_themeColor')     || payload.theme   || '#6366f1',
      virtualBg: {
        enabled: metaByType('meta_vBg_enabled') === 'true',
        preset:  metaByType('meta_vBg_preset')  || '',
        custom:  vBgFile ? `${uploadsBase}${vBgFile}` : '',
      },
      ...socialData,
    }
    
    setAll(cardData)
  }

  const toApiLinks = () => {
    const linkPairs = [
      ['phone', card.phone],
      ['website', card.companyUrl],
      ['custom', card.customLink, card.customLinkLabel || 'Custom Link'],
      ['twitter', card.twitter],
      ['instagram', card.instagram],
      ['threads', card.threads],
      ['linkedin', card.linkedin],
      ['facebook', card.facebook],
      ['youtube', card.youtube],
      ['snapchat', card.snapchat],
      ['tiktok', card.tiktok],
      ['twitch', card.twitch],
      ['yelp', card.yelp],
      ['whatsapp', card.whatsapp],
      ['signal', card.signal],
      ['discord', card.discord],
      ['skype', card.skype],
      ['telegram', card.telegram],
      ['github', card.github],
      ['calendly', card.calendly],
    ]
    return linkPairs
      .filter(([, url]) => (url || '').trim())
      .map(([type, url, label]) => ({ type, label: label || type, url }))
  }

  const extractUploadFilename = (value) => {
    if (!value) return ''
    const marker = '/uploads/'
    return value.includes(marker) ? value.split(marker).pop() : value
  }

  const uploadImageIfNeeded = async (value) => {
    if (!value) return ''
    // Already a plain filename — use as-is
    if (!value.startsWith('data:') && !value.startsWith('http')) return value
    // Already a server URL — extract filename only, never re-upload
    if (value.startsWith('http')) return extractUploadFilename(value)
    // base64 — upload to server and return filename
    const blob = await (await fetch(value)).blob()
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
    const file = new File([blob], `upload.${ext}`, { type: blob.type || 'image/jpeg' })
    const formData = new FormData()
    formData.append('photo', file)
    const res = await api.post('/cards/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.filename || ''
  }

  const saveToBackend = async () => {
    setSaving(true)
    try {
      let resolvedCardId = serverCardId
      if (!resolvedCardId) {
        try {
          const existing = await api.get('/cards')
          resolvedCardId = existing.data?.card?.id || null
          if (resolvedCardId) setServerCardId(resolvedCardId)
        } catch (prefetchErr) {
          if (prefetchErr.response?.status !== 404) throw prefetchErr
        }
      }

      const profileFilename = await uploadImageIfNeeded(card.profilePhoto)
      const coverFilename = await uploadImageIfNeeded(card.coverPhoto)
      const logoFilename = await uploadImageIfNeeded(card.companyLogo)
      const virtualBgFilename = await uploadImageIfNeeded(card.virtualBg?.custom)
      const payload = {
        title: card.jobTitle || '',
        company: card.companyName || '',
        bio: card.headline || '',
        photo: profileFilename || '',
        theme: card.themeColor || 'default',
        links: [
          ...toApiLinks(),
          ...(card.name?.trim() ? [{ type: 'meta_name', label: 'Display Name', url: card.name.trim() }] : []),
          ...(card.email?.trim() ? [{ type: 'meta_email', label: 'Display Email', url: card.email.trim() }] : []),
          ...(card.companyName?.trim() ? [{ type: 'meta_company', label: 'Display Company', url: card.companyName.trim() }] : []),
          ...(card.department?.trim() ? [{ type: 'meta_department', label: 'Department', url: card.department.trim() }] : []),
          ...(card.accreditations?.trim() ? [{ type: 'meta_accreditations', label: 'Accreditations', url: card.accreditations.trim() }] : []),
          ...(card.address?.trim() ? [{ type: 'meta_address', label: 'Address', url: card.address.trim() }] : []),
          ...(card.leadSource?.trim() ? [{ type: 'meta_leadSource', label: 'Lead Source', url: card.leadSource.trim() }] : []),
          ...(card.leadTags?.trim() ? [{ type: 'meta_leadTags', label: 'Lead Tags', url: card.leadTags.trim() }] : []),
          ...(card.followUpDate?.trim() ? [{ type: 'meta_followUpDate', label: 'Follow Up Date', url: card.followUpDate.trim() }] : []),
          ...(card.meetingNote?.trim() ? [{ type: 'meta_meetingNote', label: 'Meeting Note', url: card.meetingNote.trim() }] : []),
          ...(card.ctaLabel?.trim() ? [{ type: 'meta_ctaLabel', label: 'CTA Label', url: card.ctaLabel.trim() }] : []),
          ...(card.ctaUrl?.trim() ? [{ type: 'meta_ctaUrl', label: 'CTA URL', url: card.ctaUrl.trim() }] : []),
          ...(card.themeColor?.trim() ? [{ type: 'meta_themeColor', label: 'Theme Color', url: card.themeColor.trim() }] : []),
          ...(card.virtualBg?.enabled ? [{ type: 'meta_vBg_enabled', label: 'Virtual BG Enabled', url: 'true' }] : []),
          ...(card.virtualBg?.preset ? [{ type: 'meta_vBg_preset', label: 'Virtual BG Preset', url: card.virtualBg.preset }] : []),
          ...(virtualBgFilename ? [{ type: 'meta_vBg_custom', label: 'Virtual BG Custom', url: virtualBgFilename }] : []),
          ...(profileFilename ? [{ type: 'meta_profile', label: 'Profile Photo', url: profileFilename }] : []),
          ...(coverFilename ? [{ type: 'meta_cover', label: 'Cover Photo', url: coverFilename }] : []),
          ...(logoFilename ? [{ type: 'meta_logo', label: 'Company Logo', url: logoFilename }] : []),
        ],
      }
      if (resolvedCardId) {
        await api.put(`/cards/${resolvedCardId}`, payload)
      } else {
        try {
          const created = await api.post('/cards', payload)
          setServerCardId(created.data.card.id)
        } catch (createErr) {
          // Safety net: if card exists despite pre-check, switch to update seamlessly.
          if (createErr.response?.status === 409) {
            const existing = await api.get('/cards')
            const existingId = existing.data?.card?.id
            if (!existingId) throw createErr
            await api.put(`/cards/${existingId}`, payload)
            setServerCardId(existingId)
          } else {
            throw createErr
          }
        }
      }
      
      // CRITICAL FIX: Update local state with server URLs after successful save
      const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'
      const uploadsBase = `${baseUrl}/uploads/`
      setAll({
        profilePhoto: profileFilename ? `${uploadsBase}${profileFilename}` : card.profilePhoto,
        coverPhoto: coverFilename ? `${uploadsBase}${coverFilename}` : card.coverPhoto,
        companyLogo: logoFilename ? `${uploadsBase}${logoFilename}` : card.companyLogo,
        virtualBg: {
          ...card.virtualBg,
          custom: virtualBgFilename ? `${uploadsBase}${virtualBgFilename}` : card.virtualBg?.custom || '',
        },
      })
      
      alert('Card saved to server successfully!')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save card to server.')
    } finally {
      setSaving(false)
    }
  }

  const deleteCard = async () => {
    if (!serverCardId) {
      localStorage.removeItem('smartcard_editor')
      window.location.reload()
      return
    }
    if (!confirm('Delete this card permanently? This cannot be undone.')) return
    try {
      await api.delete(`/cards/${serverCardId}`)
      localStorage.removeItem('smartcard_editor')
      alert('Card deleted. You can create a fresh card now.')
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete card.')
    }
  }

  useEffect(() => {
    // Clean up any localhost URLs from localStorage on component mount
    const cleanupLocalStorage = () => {
      try {
        const saved = localStorage.getItem('smartcard_editor')
        if (saved) {
          const parsed = JSON.parse(saved)
          const isLocalhostUrl = (url) => url && (url.includes('localhost') || url.includes('127.0.0.1') || url.startsWith('blob:'))
          let hasLocalhostUrls = false
          
          if (isLocalhostUrl(parsed.profilePhoto)) { parsed.profilePhoto = ''; hasLocalhostUrls = true }
          if (isLocalhostUrl(parsed.coverPhoto)) { parsed.coverPhoto = ''; hasLocalhostUrls = true }
          if (isLocalhostUrl(parsed.companyLogo)) { parsed.companyLogo = ''; hasLocalhostUrls = true }
          if (isLocalhostUrl(parsed.virtualBg?.custom)) { parsed.virtualBg.custom = ''; hasLocalhostUrls = true }
          
          if (hasLocalhostUrls) {
            localStorage.setItem('smartcard_editor', JSON.stringify(parsed))
          }
        }
      } catch (e) {
        // If localStorage is corrupted, clear it
        localStorage.removeItem('smartcard_editor')
      }
    }
    
    cleanupLocalStorage()
    
    const loadServerCard = async () => {
      try {
        const res = await api.get('/cards')
        const serverCard = res.data.card
        setServerCardId(serverCard.id)
        applyCardPayload(serverCard)
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(err)
        }
      }
    }
    loadServerCard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sectionProps = (section) => ({
    section,
    customFields: card.customFields[section] || [],
    onAddField: addCustomField,
    onRemoveField: removeCustomField,
    onUpdateField: updateCustomField,
    onReorderFields: reorderCustomFields,
  })

  const exportPNG = async () => {
    if (!previewRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: null })
      const link = document.createElement('a')
      link.download = `${card.name || 'smartcard'}-card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const shareLink = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const slug = user.slug || card.cardSlug?.trim()
    const shareUrl = slug ? `${window.location.origin}/card/${slug}` : window.location.href
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    alert('Share link copied to clipboard!')
  }

  const getShareUrl = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const slug = user.slug || card.cardSlug?.trim()
    return slug ? `${window.location.origin}/card/${slug}` : window.location.href
  }

  const shareWhatsApp = () => {
    const url = getShareUrl()
    window.open(`https://wa.me/?text=${encodeURIComponent(`Connect with me: ${url}`)}`, '_blank', 'noopener,noreferrer')
  }

  const shareEmail = () => {
    const url = getShareUrl()
    const subject = encodeURIComponent(`${card.name || 'My'} digital business card`)
    const body = encodeURIComponent(`Hi,\n\nYou can view my digital card here:\n${url}\n`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const downloadQR = async () => {
    const url = getShareUrl()
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(url)}`
    const res = await fetch(qrUrl)
    const blob = await res.blob()
    const fileUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `${(card.cardSlug || card.name || 'smartcard').replace(/\s+/g, '-').toLowerCase()}-qr.png`
    link.click()
    URL.revokeObjectURL(fileUrl)
  }

  const downloadVCF = () => {
    const fullName = card.name || 'Contact'
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${fullName}`,
      card.companyName ? `ORG:${card.companyName}` : '',
      card.jobTitle ? `TITLE:${card.jobTitle}` : '',
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : '',
      card.email ? `EMAIL;TYPE=INTERNET:${card.email}` : '',
      card.companyUrl ? `URL:${card.companyUrl}` : '',
      card.address ? `ADR:;;${card.address};;;;` : '',
      'END:VCARD',
    ].filter(Boolean)
    const blob = new Blob([lines.join('\n')], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(card.name || 'smartcard').replace(/\s+/g, '-').toLowerCase()}.vcf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(card, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(card.name || 'smartcard').replace(/\s+/g, '-').toLowerCase()}-profile.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        Object.entries(data).forEach(([k, v]) => update(k, v))
        alert('Profile imported successfully!')
      } catch {
        alert('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
  }

  const applyPreset = (preset) => {
    Object.entries(preset.data).forEach(([k, v]) => update(k, v))
  }

  const reset = () => {
    if (confirm('Reset all card data?')) localStorage.removeItem('smartcard_editor') || window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Profile Editor</span>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">Auto-saved</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreviewVisible(v => !v)} className="btn-secondary py-1.5 px-3 text-xs lg:hidden">
              {previewVisible ? <><EyeOff size={13} /> Hide Preview</> : <><Eye size={13} /> Show Preview</>}
            </button>
            <button onClick={reset} className="btn-secondary py-1.5 px-3 text-xs">
              <RotateCcw size={13} /> Reset
            </button>
            <button onClick={shareLink} className="btn-secondary py-1.5 px-3 text-xs">
              <Share2 size={13} /> Share
            </button>
            <button onClick={downloadVCF} className="btn-secondary py-1.5 px-3 text-xs">
              <Download size={13} /> VCF
            </button>
            <button onClick={exportJSON} className="btn-secondary py-1.5 px-3 text-xs">
              <FileJson size={13} /> JSON
            </button>
            <button onClick={() => importRef.current?.click()} className="btn-secondary py-1.5 px-3 text-xs">
              <Upload size={13} /> Import
            </button>
            <button onClick={exportPNG} disabled={exporting} className="btn-primary py-1.5 px-3 text-xs">
              <Download size={13} /> {exporting ? 'Exporting…' : 'Export PNG'}
            </button>
            <button onClick={saveToBackend} disabled={saving} className="btn-primary py-1.5 px-3 text-xs">
              {saving ? 'Saving...' : 'Save Online'}
            </button>
            <button onClick={deleteCard} className="btn-secondary py-1.5 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50">
              Delete Card
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) importJSON(file)
                e.target.value = ''
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">

          {/* LEFT — Live Preview */}
          <div className={`lg:w-[420px] lg:flex-shrink-0 lg:sticky lg:top-28 self-start ${previewVisible ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 card-shadow">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live Preview</p>
              </div>
              <div ref={previewRef}>
                <CardPreview card={card} />
              </div>
            </div>
          </div>

          {/* RIGHT — Editor */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Card Completeness</p>
                <p className="text-xs font-semibold text-gray-600">{completionPct}%</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${completionPct}%`, background: card.themeColor }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">Complete key fields to improve sharing and lead capture quality.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <button onClick={shareLink} className="btn-secondary text-xs py-2"><Share2 size={12} /> Copy Link</button>
                <button onClick={shareWhatsApp} className="btn-secondary text-xs py-2">WhatsApp</button>
                <button onClick={shareEmail} className="btn-secondary text-xs py-2">Email</button>
                <button onClick={downloadQR} className="btn-secondary text-xs py-2">QR PNG</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Quick Profile Presets
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button key={preset.id} onClick={() => applyPreset(preset)} className="btn-secondary text-xs py-2">
                    Apply {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual customization */}
            <VisualPanel card={card} update={update} updateNested={updateNested} />

            {/* Personal */}
            <Section title="Personal" icon={<User size={15} />} {...sectionProps('personal')}>
              <Field label="Name *" name="name" value={card.name} onChange={update} placeholder="John Doe" />
              <Field label="Job Title" name="jobTitle" value={card.jobTitle} onChange={update} placeholder="Software Engineer" />
              <Field label="Department" name="department" value={card.department} onChange={update} placeholder="Engineering" />
              <Field label="Company Name" name="companyName" value={card.companyName} onChange={update} placeholder="Acme Corp" />
              <Field label="Accreditations" name="accreditations" value={card.accreditations} onChange={update} placeholder="PhD, MBA, CPA (comma-separated)" />
              <TextareaField label="Headline" name="headline" value={card.headline} onChange={update} placeholder="Short bio or tagline…" maxLength={120} />
            </Section>

            {/* General */}
            <Section title="General" icon={<Globe size={15} />} {...sectionProps('general')}>
              <Field label="Email" name="email" value={card.email} onChange={update} type="email" placeholder="you@example.com" />
              <Field label="Phone" name="phone" value={card.phone} onChange={update} type="tel" placeholder="+1 234 567 8900" />
              <Field label="Public Card Slug" name="cardSlug" value={card.cardSlug} onChange={update} placeholder="john-doe" />
              <Field label="Company URL" name="companyUrl" value={card.companyUrl} onChange={update} type="url" placeholder="https://company.com" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Link Label" name="customLinkLabel" value={card.customLinkLabel} onChange={update} placeholder="Portfolio" />
                <Field label="Link URL" name="customLink" value={card.customLink} onChange={update} type="url" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Button Label" name="ctaLabel" value={card.ctaLabel} onChange={update} placeholder="Save Contact" />
                <Field label="CTA Button URL" name="ctaUrl" value={card.ctaUrl} onChange={update} type="url" placeholder="https://..." />
              </div>
              <Field label="Address" name="address" value={card.address} onChange={update} placeholder="123 Main St, City, Country" />
            </Section>

            {/* Social */}
            <Section title="Social" icon={<AtSign size={15} />} {...sectionProps('social')}>
              <Field label="X (Twitter)" name="twitter" value={card.twitter} onChange={update} placeholder="@username" />
              <Field label="Instagram" name="instagram" value={card.instagram} onChange={update} placeholder="@username" />
              <Field label="Threads" name="threads" value={card.threads} onChange={update} placeholder="@username" />
              <Field label="LinkedIn" name="linkedin" value={card.linkedin} onChange={update} type="url" placeholder="https://linkedin.com/in/..." />
              <Field label="Facebook" name="facebook" value={card.facebook} onChange={update} type="url" placeholder="https://facebook.com/..." />
              <Field label="YouTube" name="youtube" value={card.youtube} onChange={update} type="url" placeholder="https://youtube.com/@..." />
              <Field label="Snapchat" name="snapchat" value={card.snapchat} onChange={update} placeholder="@username" />
              <Field label="TikTok" name="tiktok" value={card.tiktok} onChange={update} placeholder="@username" />
              <Field label="Twitch" name="twitch" value={card.twitch} onChange={update} placeholder="username" />
              <Field label="Yelp" name="yelp" value={card.yelp} onChange={update} type="url" placeholder="https://yelp.com/biz/..." />
            </Section>

            {/* Messaging */}
            <Section title="Messaging" icon={<MessageCircle size={15} />} {...sectionProps('messaging')}>
              <Field label="WhatsApp" name="whatsapp" value={card.whatsapp} onChange={update} type="tel" placeholder="+1 234 567 8900" />
              <Field label="Signal" name="signal" value={card.signal} onChange={update} type="tel" placeholder="+1 234 567 8900" />
              <Field label="Discord" name="discord" value={card.discord} onChange={update} placeholder="username#0000" />
              <Field label="Skype" name="skype" value={card.skype} onChange={update} placeholder="live:username" />
              <Field label="Telegram" name="telegram" value={card.telegram} onChange={update} placeholder="@username" />
            </Section>

            {/* Business */}
            <Section title="Business" icon={<Briefcase size={15} />} {...sectionProps('business')}>
              <Field label="GitHub" name="github" value={card.github} onChange={update} type="url" placeholder="https://github.com/username" />
              <Field label="Calendly" name="calendly" value={card.calendly} onChange={update} type="url" placeholder="https://calendly.com/username" />
            </Section>

            <Section title="Lead Capture" icon={<Target size={15} />} {...sectionProps('lead')}>
              <Field label="Lead Source" name="leadSource" value={card.leadSource} onChange={update} placeholder="Event, LinkedIn, Website..." />
              <Field label="Tags" name="leadTags" value={card.leadTags} onChange={update} placeholder="vip, demo-request, high-intent" />
              <Field label="Follow-up Date" name="followUpDate" value={card.followUpDate} onChange={update} type="date" />
              <TextareaField label="Meeting Notes" name="meetingNote" value={card.meetingNote} onChange={update} placeholder="Context to remember after first contact..." maxLength={220} />
            </Section>

          </div>
        </div>
      </div>
    </div>
  )
}

import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon } from 'lucide-react'

const ICON_MAP = {
  email: <Mail size={16} />, phone: <Phone size={16} />, website: <Globe size={16} />,
  address: <MapPin size={16} />, twitter: <AtSign size={16} />, instagram: <AtSign size={16} />,
  threads: <AtSign size={16} />, linkedin: <AtSign size={16} />, facebook: <AtSign size={16} />,
  youtube: <AtSign size={16} />, snapchat: <AtSign size={16} />, tiktok: <AtSign size={16} />,
  twitch: <AtSign size={16} />, yelp: <AtSign size={16} />, whatsapp: <MessageCircle size={16} />,
  signal: <MessageCircle size={16} />, discord: <MessageCircle size={16} />,
  skype: <MessageCircle size={16} />, telegram: <MessageCircle size={16} />,
  github: <GitBranch size={16} />, calendly: <Calendar size={16} />,
}

export default function CardPreview({ card = {} }) {
  const uploadsBase = 'https://kairatechnologies.co.in/demo/vcard/uploads/'
  const links = card.links || []

  const metaByType = (type) => links.find(l => l.type === type)?.url || ''

  const themeColor = metaByType('meta_themeColor') || '#6366f1'
  const vBgEnabled = metaByType('meta_vBg_enabled') === 'true'
  const vBgPreset  = metaByType('meta_vBg_preset') || ''
  const vBgCustomFile = metaByType('meta_vBg_custom') || ''

  const bgStyle = vBgEnabled
    ? vBgCustomFile
      ? { backgroundImage: `url(${uploadsBase}${vBgCustomFile})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: vBgPreset ? `linear-gradient(135deg, ${vBgPreset})` : '#f3f4f6' }
    : { background: '#f3f4f6' }

  const profileFile = metaByType('meta_profile')
  const coverFile   = metaByType('meta_cover')
  const logoFile    = metaByType('meta_logo')

  const profilePhotoUrl = profileFile ? `${uploadsBase}${profileFile}` : (card.photo ? `${uploadsBase}${card.photo}` : '')
  const coverPhotoUrl   = coverFile   ? `${uploadsBase}${coverFile}`   : ''
  const logoUrl         = logoFile    ? `${uploadsBase}${logoFile}`    : ''

  const displayName    = metaByType('meta_name')    || card.name    || 'Your Name'
  const displayEmail   = metaByType('meta_email')   || card.email   || ''
  const displayCompany = metaByType('meta_company') || card.company || ''
  const department     = metaByType('meta_department')
  const accreditations = metaByType('meta_accreditations')
  const ctaLabel       = metaByType('meta_ctaLabel')

  const fields = [
    displayEmail && { key: 'email', label: 'Email', value: displayEmail },
    ...links.filter(l => !String(l.type || '').startsWith('meta_')).map(l => ({
      key: l.type || 'link',
      label: l.label || l.type || 'Link',
      value: l.url,
    })),
  ].filter(Boolean)

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden" style={bgStyle}>
      {coverPhotoUrl && (
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${coverPhotoUrl})` }} />
      )}

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

      <div className="px-6 pb-6 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          {card.title && <p className="text-sm text-gray-600 mt-0.5">{card.title}</p>}
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

        {card.bio && <p className="text-sm text-gray-500 leading-relaxed">{card.bio}</p>}

        {fields.length > 0 && (
          <div className="space-y-2 pt-2">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: `${themeColor}10` }}>
                <span style={{ color: themeColor }}>{ICON_MAP[f.key] || <LinkIcon size={16} />}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="text-sm text-gray-700 truncate">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-3">
          <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: themeColor }}>
            Share
          </button>
          <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2" style={{ borderColor: themeColor, color: themeColor }}>
            {ctaLabel || 'Save Contact'}
          </button>
        </div>
      </div>
    </div>
  )
}

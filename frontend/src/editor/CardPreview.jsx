import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon } from 'lucide-react'

const ICON_MAP = {
  email: <Mail size={16} />, phone: <Phone size={16} />, companyUrl: <Globe size={16} />,
  address: <MapPin size={16} />, twitter: <AtSign size={16} />, instagram: <AtSign size={16} />,
  threads: <AtSign size={16} />, linkedin: <AtSign size={16} />, facebook: <AtSign size={16} />,
  youtube: <AtSign size={16} />, snapchat: <AtSign size={16} />, tiktok: <AtSign size={16} />,
  twitch: <AtSign size={16} />, yelp: <AtSign size={16} />, whatsapp: <MessageCircle size={16} />,
  signal: <MessageCircle size={16} />, discord: <MessageCircle size={16} />,
  skype: <MessageCircle size={16} />, telegram: <MessageCircle size={16} />,
  github: <GitBranch size={16} />, calendly: <Calendar size={16} />,
  customLink: <LinkIcon size={16} />,
}

export default function CardPreview({ card }) {
  const bgStyle = card.virtualBg.enabled
    ? card.virtualBg.custom
      ? { backgroundImage: `url(${card.virtualBg.custom})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { background: card.virtualBg.preset ? `linear-gradient(135deg, ${card.virtualBg.preset})` : '#f3f4f6' }
    : { background: '#f3f4f6' }

  const fields = [
    card.email && { key: 'email', label: 'Email', value: card.email },
    card.phone && { key: 'phone', label: 'Phone', value: card.phone },
    card.companyUrl && { key: 'companyUrl', label: 'Website', value: card.companyUrl },
    card.customLink && { key: 'customLink', label: card.customLinkLabel || 'Link', value: card.customLink },
    card.address && { key: 'address', label: 'Address', value: card.address },
    card.twitter && { key: 'twitter', label: 'X', value: card.twitter },
    card.instagram && { key: 'instagram', label: 'Instagram', value: card.instagram },
    card.threads && { key: 'threads', label: 'Threads', value: card.threads },
    card.linkedin && { key: 'linkedin', label: 'LinkedIn', value: card.linkedin },
    card.facebook && { key: 'facebook', label: 'Facebook', value: card.facebook },
    card.youtube && { key: 'youtube', label: 'YouTube', value: card.youtube },
    card.snapchat && { key: 'snapchat', label: 'Snapchat', value: card.snapchat },
    card.tiktok && { key: 'tiktok', label: 'TikTok', value: card.tiktok },
    card.twitch && { key: 'twitch', label: 'Twitch', value: card.twitch },
    card.yelp && { key: 'yelp', label: 'Yelp', value: card.yelp },
    card.whatsapp && { key: 'whatsapp', label: 'WhatsApp', value: card.whatsapp },
    card.signal && { key: 'signal', label: 'Signal', value: card.signal },
    card.discord && { key: 'discord', label: 'Discord', value: card.discord },
    card.skype && { key: 'skype', label: 'Skype', value: card.skype },
    card.telegram && { key: 'telegram', label: 'Telegram', value: card.telegram },
    card.github && { key: 'github', label: 'GitHub', value: card.github },
    card.calendly && { key: 'calendly', label: 'Calendly', value: card.calendly },
  ].filter(Boolean)

  Object.values(card.customFields).flat().forEach(cf => {
    if (cf.value) fields.push({ key: cf.id, label: cf.label, value: cf.value })
  })

  const tags = (card.leadTags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden" style={bgStyle}>
      {/* Cover */}
      {card.coverPhoto && (
        <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${card.coverPhoto})` }} />
      )}

      {/* Profile + Logo */}
      <div className="relative px-6 pt-6 pb-4">
        {card.companyLogo && (
          <img src={card.companyLogo} alt="logo" className="absolute top-4 right-4 w-12 h-12 object-contain rounded-lg bg-white/80 p-1" />
        )}
        {card.profilePhoto ? (
          <img src={card.profilePhoto} alt={card.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold" style={{ background: card.themeColor, color: '#fff' }}>
            {card.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-6 pb-6 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{card.name || 'Your Name'}</h1>
          {card.jobTitle && <p className="text-sm text-gray-600 mt-0.5">{card.jobTitle}</p>}
          {card.department && <p className="text-xs text-gray-400">{card.department}</p>}
          {card.companyName && <p className="text-sm font-medium text-gray-700 mt-1">{card.companyName}</p>}
          {card.accreditations && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.accreditations.split(',').map((a, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${card.themeColor}20`, color: card.themeColor }}>
                  {a.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {card.headline && (
          <p className="text-sm text-gray-500 leading-relaxed">{card.headline}</p>
        )}

        {(card.leadSource || tags.length > 0 || card.followUpDate) && (
          <div className="rounded-xl border border-gray-100 p-3 space-y-2 bg-white/80">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Lead Context</p>
            {card.leadSource && <p className="text-xs text-gray-600">Source: {card.leadSource}</p>}
            {card.followUpDate && <p className="text-xs text-gray-600">Follow-up: {card.followUpDate}</p>}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fields */}
        {fields.length > 0 && (
          <div className="space-y-2 pt-2">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: `${card.themeColor}10` }}>
                <span style={{ color: card.themeColor }}>{ICON_MAP[f.key] || <LinkIcon size={16} />}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="text-sm text-gray-700 truncate">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2 pt-3">
          <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: card.themeColor }}>
            Share
          </button>
          <a
            href={card.ctaUrl || '#'}
            target={card.ctaUrl ? '_blank' : undefined}
            rel={card.ctaUrl ? 'noreferrer' : undefined}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all text-center"
            style={{ borderColor: card.themeColor, color: card.themeColor }}
          >
            {card.ctaLabel || 'Save Contact'}
          </a>
        </div>
      </div>
    </div>
  )
}

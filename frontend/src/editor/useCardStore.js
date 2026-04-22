import { useState, useEffect, useCallback } from 'react'

export const THEME_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#ef4444','#f97316',
  '#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6',
  '#1d4ed8','#7c3aed','#db2777','#dc2626','#ea580c',
  '#ca8a04','#16a34a','#0d9488','#0891b2','#2563eb',
]

export const VIRTUAL_BG_PRESETS = [
  { id: 'office',   label: 'Office',   color: 'linear-gradient(135deg,#1e3a5f,#2d6a9f)' },
  { id: 'gradient', label: 'Gradient', color: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { id: 'blur',     label: 'Blur',     color: 'linear-gradient(135deg,#e0e0e0,#f8f9fa)' },
  { id: 'nature',   label: 'Nature',   color: 'linear-gradient(135deg,#134e5e,#71b280)' },
  { id: 'abstract', label: 'Abstract', color: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { id: 'branded',  label: 'Branded',  color: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
]

const DEFAULT_CARD = {
  coverPhoto: '', profilePhoto: '', companyLogo: '',
  themeColor: '#6366f1',
  virtualBg: { enabled: false, preset: 'gradient', custom: '' },
  name: '', jobTitle: '', department: '', companyName: '',
  accreditations: '', headline: '',
  email: '', phone: '', companyUrl: '', customLink: '',
  customLinkLabel: '', address: '',
  twitter: '', instagram: '', threads: '', linkedin: '',
  facebook: '', youtube: '', snapchat: '', tiktok: '',
  twitch: '', yelp: '',
  whatsapp: '', signal: '', discord: '', skype: '', telegram: '',
  github: '', calendly: '',
  cardSlug: '', ctaLabel: 'Save Contact', ctaUrl: '',
  leadSource: '', leadTags: '', followUpDate: '', meetingNote: '',
  customFields: { personal: [], general: [], social: [], messaging: [], business: [], lead: [] },
}

export function useCardStore() {
  const [card, setCard] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcard_editor')
      if (!saved) return DEFAULT_CARD
      const parsed = JSON.parse(saved)
      // Clear stale localhost image URLs but keep valid server URLs and data URLs
      const cleanCard = { ...DEFAULT_CARD, ...parsed }
      const isLocalhostUrl = (url) => url && (url.includes('localhost') || url.includes('127.0.0.1') || url.startsWith('blob:'))
      if (isLocalhostUrl(cleanCard.profilePhoto)) cleanCard.profilePhoto = ''
      if (isLocalhostUrl(cleanCard.coverPhoto)) cleanCard.coverPhoto = ''
      if (isLocalhostUrl(cleanCard.companyLogo)) cleanCard.companyLogo = ''
      if (isLocalhostUrl(cleanCard.virtualBg?.custom)) cleanCard.virtualBg.custom = ''
      return cleanCard
    } catch { return DEFAULT_CARD }
  })

  useEffect(() => {
    const { profilePhoto, coverPhoto, companyLogo, virtualBg, ...rest } = card
    // Only save valid URLs: http(s) URLs, data: URLs, but never localhost or blob: URLs
    const isValidUrl = (url) => {
      if (!url || !url.trim()) return false
      if (url.startsWith('data:')) return true
      if (url.startsWith('blob:')) return false
      if (url.includes('localhost') || url.includes('127.0.0.1')) return false
      if (url.startsWith('http')) return true
      return false
    }
    
    localStorage.setItem('smartcard_editor', JSON.stringify({
      ...rest,
      profilePhoto: isValidUrl(profilePhoto) ? profilePhoto : '',
      coverPhoto: isValidUrl(coverPhoto) ? coverPhoto : '',
      companyLogo: isValidUrl(companyLogo) ? companyLogo : '',
      virtualBg: { ...virtualBg, custom: isValidUrl(virtualBg?.custom) ? virtualBg.custom : '' },
    }))
  }, [card])

  const update = useCallback((key, value) =>
    setCard(prev => ({ ...prev, [key]: value })), [])

  const setAll = useCallback((data) =>
    setCard(prev => ({ ...prev, ...data })), [])

  const updateNested = useCallback((key, subKey, value) =>
    setCard(prev => ({ ...prev, [key]: { ...prev[key], [subKey]: value } })), [])

  const addCustomField = useCallback((section, field) =>
    setCard(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [section]: [...(prev.customFields[section] || []), field],
      },
    })), [])

  const removeCustomField = useCallback((section, id) =>
    setCard(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [section]: prev.customFields[section].filter(f => f.id !== id),
      },
    })), [])

  const updateCustomField = useCallback((section, id, value) =>
    setCard(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [section]: prev.customFields[section].map(f => f.id === id ? { ...f, value } : f),
      },
    })), [])

  const reorderCustomFields = useCallback((section, fields) =>
    setCard(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [section]: fields },
    })), [])

  return { card, update, setAll, updateNested, addCustomField, removeCustomField, updateCustomField, reorderCustomFields }
}

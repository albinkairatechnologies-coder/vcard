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
      return saved ? { ...DEFAULT_CARD, ...JSON.parse(saved) } : DEFAULT_CARD
    } catch { return DEFAULT_CARD }
  })

  useEffect(() => {
    localStorage.setItem('smartcard_editor', JSON.stringify(card))
  }, [card])

  const update = useCallback((key, value) =>
    setCard(prev => ({ ...prev, [key]: value })), [])

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

  return { card, update, updateNested, addCustomField, removeCustomField, updateCustomField, reorderCustomFields }
}

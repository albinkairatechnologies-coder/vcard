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
      // Clear stale localhost image URLs
      if (
        parsed.profilePhoto?.includes('localhost') ||
        parsed.coverPhoto?.includes('localhost') ||
        parsed.companyLogo?.includes('localhost') ||
        parsed.virtualBg?.custom?.includes('localhost')
      ) {
        return {
          ...DEFAULT_CARD, ...parsed,
          profilePhoto: '',
          coverPhoto: '',
          companyLogo: '',
          virtualBg: { ...(parsed.virtualBg || {}), custom: '' },
        }
      }
      return { ...DEFAULT_CARD, ...parsed }
    } catch { return DEFAULT_CARD }
  })

  useEffect(() => {
    const { profilePhoto, coverPhoto, companyLogo, virtualBg, ...rest } = card
    // Only save http URLs and data: URLs (for unsaved uploads), clear blob: URLs
    localStorage.setItem('smartcard_editor', JSON.stringify({
      ...rest,
      profilePhoto: (profilePhoto?.startsWith('http') || profilePhoto?.startsWith('data:')) ? profilePhoto : '',
      coverPhoto: (coverPhoto?.startsWith('http') || coverPhoto?.startsWith('data:')) ? coverPhoto : '',
      companyLogo: (companyLogo?.startsWith('http') || companyLogo?.startsWith('data:')) ? companyLogo : '',
      virtualBg: { ...virtualBg, custom: (virtualBg?.custom?.startsWith('http') || virtualBg?.custom?.startsWith('data:')) ? virtualBg.custom : '' },
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

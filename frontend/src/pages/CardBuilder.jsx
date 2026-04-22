import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, Camera, Check } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import CardPreview from '../components/CardPreview'
import SocialLinkInput from '../components/SocialLinkInput'

const THEMES = [
  { id: 'default',  label: 'Default',   from: '#6366f1', to: '#9333ea' },
  { id: 'ocean',    label: 'Ocean',     from: '#06b6d4', to: '#2563eb' },
  { id: 'forest',   label: 'Forest',    from: '#22c55e', to: '#059669' },
  { id: 'sunset',   label: 'Sunset',    from: '#f97316', to: '#ec4899' },
  { id: 'midnight', label: 'Midnight',  from: '#1f2937', to: '#030712' },
]

export default function CardBuilder() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [links, setLinks] = useState([])
  const [existingCardId, setExistingCardId] = useState(null)
  const [preview, setPreview] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [existingPhoto, setExistingPhoto] = useState('')

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { title: '', company: '', bio: '', theme: 'default' },
  })

  const watched = watch()

  useEffect(() => {
    setPreview({ ...watched, name: user.name, email: user.email, photo: photoPreview, links })
  }, [watched, links, photoPreview]) // eslint-disable-line

  useEffect(() => {
    api.get('/cards').then((res) => {
      const c = res.data.card
      setExistingCardId(c.id)
      reset({ title: c.title || '', company: c.company || '', bio: c.bio || '', theme: c.theme || 'default' })
      setLinks(c.links || [])
      if (c.photo) {
        setExistingPhoto(c.photo)
        const baseUrl = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'
        setPhotoPreview(`${baseUrl}/uploads/${c.photo}`)
      }
    }).catch(() => {})
  }, []) // eslint-disable-line

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const uploadPhoto = async () => {
    if (!photoFile) return null
    const form = new FormData()
    form.append('photo', photoFile)
    const res = await api.post('/cards/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data.filename
  }

  const onSubmit = async (data) => {
    setSaving(true)
    setError('')
    try {
      let photoFilename = existingPhoto || ''
      if (photoFile) {
        const uploaded = await uploadPhoto()
        if (uploaded) photoFilename = uploaded
      }
      const payload = { ...data, photo: photoFilename, links }
      if (existingCardId) {
        await api.put(`/cards/${existingCardId}`, payload)
      } else {
        await api.post('/cards', payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save card.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900">
            {existingCardId ? 'Edit your card' : 'Create your card'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Changes are reflected in the live preview instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">

            {/* Photo upload */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Profile photo</p>
              <div className="flex items-center gap-5">
                <div className="relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Camera size={24} className="text-gray-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={20} className="text-white" />
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="btn-secondary text-xs cursor-pointer">
                    <Camera size={14} /> Upload photo
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or GIF · Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic info */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow space-y-4">
              <p className="text-sm font-semibold text-gray-700">Basic info</p>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Job title</label>
                <input type="text" className="input-field" placeholder="Software Engineer" {...register('title')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Company</label>
                <input type="text" className="input-field" placeholder="Acme Corp" {...register('company')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="A short bio about yourself…"
                  {...register('bio')}
                />
              </div>
            </div>

            {/* Theme picker */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Card theme</p>
              <div className="grid grid-cols-5 gap-3">
                {THEMES.map((t) => (
                  <label key={t.id} className="cursor-pointer group">
                    <input type="radio" value={t.id} className="sr-only" {...register('theme')} />
                    <div className={`relative rounded-xl overflow-hidden transition-all ${watched.theme === t.id ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                      <div
                        className="h-12 w-full"
                        style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                      />
                      {watched.theme === t.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-1.5 font-medium">{t.label}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 card-shadow">
              <p className="text-sm font-semibold text-gray-700 mb-4">Links & contacts</p>
              <SocialLinkInput links={links} onChange={setLinks} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={saving} className="btn-primary w-full py-3">
              <Save size={16} /> {saving ? 'Saving…' : 'Save card'}
            </button>
          </form>

          {/* Live preview */}
          <div className="lg:sticky lg:top-24 self-start animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live preview</p>
              </div>
              <CardPreview card={preview} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

import { useRef } from 'react'
import { Camera, Image, Building2, Palette, Monitor, Check } from 'lucide-react'
import { THEME_COLORS, VIRTUAL_BG_PRESETS } from './useCardStore'

function ImageUpload({ label, icon, value, onChange, round }) {
  const ref = useRef()
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => ref.current.click()}
        className={`relative group overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all bg-gray-50 hover:bg-indigo-50 flex items-center justify-center ${round ? 'w-20 h-20 rounded-full' : 'w-full h-20 rounded-xl'}`}
      >
        {value ? (
          <img src={value} alt={label} className={`w-full h-full object-cover ${round ? 'rounded-full' : 'rounded-xl'}`} />
        ) : (
          <span className="text-gray-400 group-hover:text-indigo-400 transition-colors">{icon}</span>
        )}
        <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${round ? 'rounded-full' : 'rounded-xl'}`}>
          <Camera size={18} className="text-white" />
        </div>
      </button>
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

export default function VisualPanel({ card, update, updateNested }) {
  return (
    <div className="space-y-5">
      {/* Photos row */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Image size={14} /> Photos & Logo
        </p>
        <div className="grid grid-cols-3 gap-3">
          <ImageUpload label="Cover Photo" icon={<Image size={22} />} value={card.coverPhoto} onChange={v => update('coverPhoto', v)} />
          <ImageUpload label="Profile Photo" icon={<Camera size={22} />} value={card.profilePhoto} onChange={v => update('profilePhoto', v)} round />
          <ImageUpload label="Company Logo" icon={<Building2 size={22} />} value={card.companyLogo} onChange={v => update('companyLogo', v)} />
        </div>
      </div>

      {/* Theme color */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Palette size={14} /> Theme Color
        </p>
        <div className="grid grid-cols-10 gap-2 mb-3">
          {THEME_COLORS.map(color => (
            <button
              key={color}
              onClick={() => update('themeColor', color)}
              className="w-7 h-7 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
              style={{ background: color }}
            >
              {card.themeColor === color && <Check size={12} className="text-white" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={card.themeColor}
            onChange={e => update('themeColor', e.target.value)}
            className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={card.themeColor}
            onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && update('themeColor', e.target.value)}
            className="input-field font-mono text-sm"
            placeholder="#6366f1"
          />
        </div>
      </div>

      {/* Virtual background */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
            <Monitor size={14} /> Virtual Background
          </p>
          <button
            onClick={() => updateNested('virtualBg', 'enabled', !card.virtualBg.enabled)}
            className={`relative w-10 h-5 rounded-full transition-colors ${card.virtualBg.enabled ? 'bg-indigo-500' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${card.virtualBg.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {card.virtualBg.enabled && (
          <div className="space-y-3 animate-fade-in-up">
            <div className="grid grid-cols-3 gap-2">
              {VIRTUAL_BG_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => updateNested('virtualBg', 'preset', p.color)}
                  className={`h-14 rounded-xl border-2 transition-all hover:scale-105 ${card.virtualBg.preset === p.color ? 'border-indigo-500 scale-105' : 'border-transparent'}`}
                  style={{ background: p.color }}
                  title={p.label}
                />
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Or upload custom background</p>
              <label className="flex items-center gap-2 cursor-pointer btn-secondary text-xs py-2">
                <Image size={14} /> Upload image
                <input type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => updateNested('virtualBg', 'custom', ev.target.result)
                  reader.readAsDataURL(file)
                }} />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

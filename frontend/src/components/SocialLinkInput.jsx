import { Plus, Trash2 } from 'lucide-react'

const LINK_TYPES = [
  'LinkedIn', 'GitHub', 'Twitter', 'Instagram',
  'Website', 'Email', 'Phone', 'WhatsApp',
]

export default function SocialLinkInput({ links, onChange }) {
  const add = () =>
    onChange([...links, { type: 'Website', label: '', url: '' }])

  const remove = (i) =>
    onChange(links.filter((_, idx) => idx !== i))

  const update = (i, field, value) =>
    onChange(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l))

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-start">
          <select
            value={link.type}
            onChange={(e) => update(i, 'type', e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {LINK_TYPES.map((t) => (
              <option key={t} value={t.toLowerCase()}>{t}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Label (optional)"
            value={link.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
          />

          <input
            type="text"
            placeholder="URL or value"
            value={link.url}
            onChange={(e) => update(i, 'url', e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
          />

          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
      >
        <Plus size={16} /> Add link
      </button>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { X, Download, Copy, Check } from 'lucide-react'

export default function QRModal({ slug, onClose }) {
  const overlayRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const publicUrl = `${window.location.origin}/card/${slug}`
  const qrUrl = `/api/qr/${slug}?target=${encodeURIComponent(publicUrl)}`

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const download = () => {
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `qr-${slug}.png`
    a.click()
  }

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div className="bg-white rounded-3xl card-shadow w-full max-w-xs p-6 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Share your card</h2>
        <p className="text-xs text-gray-400 mb-5 break-all">{publicUrl}</p>

        <div className="flex justify-center mb-5 p-4 bg-gray-50 rounded-2xl">
          <img src={qrUrl} alt="QR Code" className="w-44 h-44 rounded-xl" />
        </div>

        <div className="flex gap-2">
          <button onClick={download} className="btn-primary flex-1 py-2.5">
            <Download size={15} /> Download
          </button>
          <button onClick={copy} className="btn-secondary flex-1 py-2.5">
            {copied ? <><Check size={15} className="text-green-500" /> Copied!</> : <><Copy size={15} /> Copy link</>}
          </button>
        </div>
      </div>
    </div>
  )
}

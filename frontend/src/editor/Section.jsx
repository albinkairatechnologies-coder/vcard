import { useState } from 'react'
import { ChevronDown, Plus, X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddFieldModal from './AddFieldModal'

function SortableField({ field, onRemove, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group animate-fade-in-up">
      <button {...attributes} {...listeners} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical size={16} />
      </button>
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">{field.label}</p>
        <input
          className="input-field text-sm"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          value={field.value}
          onChange={e => onUpdate(field.id, e.target.value)}
          type={field.type === 'Email' ? 'email' : field.type === 'Phone' ? 'tel' : field.type === 'URL' ? 'url' : 'text'}
        />
      </div>
      <button onClick={() => onRemove(field.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-4">
        <X size={16} />
      </button>
    </div>
  )
}

export default function Section({ title, icon, section, children, customFields, onAddField, onRemoveField, onUpdateField, onReorderFields }) {
  const [open, setOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = customFields.findIndex(f => f.id === active.id)
    const newIndex = customFields.findIndex(f => f.id === over.id)
    onReorderFields(section, arrayMove(customFields, oldIndex, newIndex))
  }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 py-4 space-y-4 bg-white">
          {children}

          {/* Custom fields with drag-to-reorder */}
          {customFields?.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={customFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 pt-1">
                  {customFields.map(field => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onRemove={(id) => onRemoveField(section, id)}
                      onUpdate={(id, val) => onUpdateField(section, id, val)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors mt-1"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>
      )}

      {showModal && (
        <AddFieldModal
          section={section}
          onAdd={onAddField}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

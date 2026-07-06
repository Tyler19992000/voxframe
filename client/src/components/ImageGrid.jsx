import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';

function SortableImage({ image, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-video bg-bg rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-colors"
    >
      <img src={image.url} alt={image.originalName || `Image ${index + 1}`} className="w-full h-full object-cover" />

      {/* Order badge */}
      <div className="absolute top-2 left-2 w-6 h-6 bg-black/70 rounded-md flex items-center justify-center text-xs font-bold text-white">
        {index + 1}
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-8 w-6 h-6 bg-black/70 rounded-md items-center justify-center cursor-grab hidden group-hover:flex"
      >
        <GripVertical size={13} className="text-white" />
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-accent rounded-md items-center justify-center transition-colors hidden group-hover:flex"
      >
        <X size={13} className="text-white" />
      </button>
    </div>
  );
}

export default function ImageGrid({ images, onReorder, onRemove }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reordered = [...images];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      onReorder(reordered);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <SortableImage key={image.id} image={image} index={index} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

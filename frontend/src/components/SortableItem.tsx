import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { SortableItemProps } from '../interfaces/Recipe';

function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };
  
    return (
      <div ref={setNodeRef} style={style} className="flex gap-4 items-start mb-4">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-600 mt-3">
          <GripVertical className="w-4 h-4" />
        </div>
        {children}
      </div>
    );
};

export default SortableItem;
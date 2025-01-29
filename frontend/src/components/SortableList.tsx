// SortableList.tsx
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { SortableListProps } from '../interfaces/Recipe';

function SortableList<T>({ items, setItems, renderItem, groupId, onDragEnd }: SortableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (onDragEnd) {
      onDragEnd(event);
    } else if (active.id !== over.id) {
      const oldIndex = items.findIndex((_, i) => `${groupId ? `${groupId}-` : ''}item-${i}` === active.id);
      const newIndex = items.findIndex((_, i) => `${groupId ? `${groupId}-` : ''}item-${i}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setItems(arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map((_, i) => `${groupId ? `${groupId}-` : ''}item-${i}`)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem 
            key={`${groupId ? `${groupId}-` : ''}item-${index}`} 
            id={`${groupId ? `${groupId}-` : ''}item-${index}`}
          >
            {renderItem(item, index)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableList;
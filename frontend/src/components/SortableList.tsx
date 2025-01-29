import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { SortableListProps } from '../interfaces/Recipe';

function SortableList<T>({ items, setItems, renderItem }: SortableListProps<T>) {
    const sensors = useSensors(useSensor(PointerSensor));
  
    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = parseInt(active.id.split('-')[1]);
        const newIndex = parseInt(over.id.split('-')[1]);
        setItems(arrayMove(items, oldIndex, newIndex));
      }
    };
  
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext 
          items={items.map((_, i: number) => `item-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item: any, index: number) => (
            <SortableItem key={`item-${index}`} id={`item-${index}`}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    );
};

export default SortableList;
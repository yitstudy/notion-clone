import { cn } from '@/lib/utils';
import { NoteItem } from './NoteItem';
import { useNoteStore } from '@/modules/notes/note.state';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { noteRepository } from '@/modules/notes/note.repository';
import { Note } from '@/modules/notes/note.entity';

interface NoteListProps {
  layer?: number;
  parentId?: number;
}

export function NoteList({ layer = 0, parentId }: NoteListProps) {
  const noteStore = useNoteStore();  
  const notes = noteStore.getAll();
  const {currentUser} = useCurrentUserStore();

  const createChild = async (e: React.MouseEvent, parentId: number) => {
    e.stopPropagation();
    const newNote = await noteRepository.create(currentUser!.id, { parentId });
    noteStore.set([newNote]);
  };

  const fetchChildren = async (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    const children = await noteRepository.find(currentUser!.id, note.id);
    if (children == null) return;
    noteStore.set(children);
  };

  return (
    <>
      <p
        className={cn(
          `hidden text-sm font-medium text-muted-foreground/80`,
          layer === 0 && 'hidden'
        )}
        style={{ paddingLeft: layer ? `${layer * 12 + 25}px` : undefined }}
      >
        ページがありません
      </p>
      {notes
        .filter((note) => note.parent_document == parentId)
        .map((note) => {
          return (
            <div key={note.id}>
              <NoteItem 
                note={note} 
                layer={layer}
                onExpand={(e:React.MouseEvent) => fetchChildren(e, note)}
                onCreate = {(e) => createChild(e, note.id)} 
              />
              <NoteList layer={layer + 1} parentId={note.id} />
            </div>
          );
        })}
    </>
  );
}

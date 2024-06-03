import { useEffect, useState } from "react";
import "./App.css";

type Note = {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const data: Note[] = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("An error occurred while fetching the notes", error);
      }
    };

  fetchNotes();
  }, []);

  const handleClickNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
          body: JSON.stringify({
          title: title,
          content: content
        })
      });

      const newNote = await response.json();
      // Adds the new note to the notes array
      setNotes([newNote, ...notes]);
    } catch (e) {
      console.error("An error occurred while adding the note", e);
    }

    // Clears the input fields of the form
    setTitle("");
    setContent("");
  }

  const handleEditNode = async (e: React.FormEvent) => 
  {
    e.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title,
          content: content
        })
      });

      const editedNote = await response.json();
      setNotes(notes.map((note) => 
        note.id === editedNote.id ? editedNote : note
      ));
    } catch (e) {
      console.error("An error occurred while editing the note", e);
    }

    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const handleCancelEdit = () => 
  {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const deleteNote = async (
    event: React.MouseEvent, 
    noteId: number) =>
    {
      // Prevents the event from bubbling up the DOM tree
      event.stopPropagation();

      try {
        const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
          method: "DELETE"
        });
        // Filters out the note with the id that matches the noteId
        setNotes(notes.filter((note) => 
          note.id !== noteId
        ));
      } catch (e) {
        console.error("An error occurred while deleting the note", e);
      }
    }

  return (
    <div className="app-container">
      <form className="note-form" onSubmit = {(event) => selectedNote ? handleEditNode(event) : handleAddNote(event)}>
        <input
          value = {title}
          onChange={(e) => 
            setTitle(e.target.value)
          }
          placeholder="Title"
          required 
        ></input>
        <textarea
          value={content}
          onChange = {(e) => 
            setContent(e.target.value)
          }
          placeholder="Content..."
          rows={10}
          required
        ></textarea>
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">
              Save
            </button>
            <button onClick = {handleCancelEdit}>
              Cancel
            </button>
          </div>
        ) : <button type="submit">
              Add Note
            </button>
        }
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" key={note.id} onClick = {() => handleClickNote(note)}>
            <div className="note-header">
              <button onClick = {(event) => 
                deleteNote(event, note.id)
                }>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

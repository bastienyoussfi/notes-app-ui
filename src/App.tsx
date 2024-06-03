import { useState } from "react";
import "./App.css";

type Note = {
  id: number;
  title: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<
  Note[]
  >([
    {
      id: 1,
      title: "Note Title 1",
      content: "Note Description"
    },
    {
      id: 2,
      title: "Note Title 2",
      content: "Note Description"
    },
    {
      id: 3,
      title: "Note Title 3",
      content: "Note Description"
    }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleClickNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleAddNote = (e: React.FormEvent) => 
    {
      e.preventDefault();
      console.log(title)
      console.log(content)

      // Creates a new note object
      const newNote: Note = {
        id: notes.length + 1,
        title: title,
        content: content
      };
      // Adds the new note to the notes array
      setNotes([newNote, ...notes]);
      // Clears the input fields of the form
      setTitle("");
      setContent("");
    }

  return (
    <div className="app-container">
      <form className="note-form" onSubmit = {(event) => handleAddNote(event)}>
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
        <button type="submit">
          Add Note
        </button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" key={note.id} onClick = {() => handleClickNote(note)}>
            <div className="note-header">
              <button>x</button>
              <button>Edit</button>
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

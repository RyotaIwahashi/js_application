import React from 'react'

const NoteForm = ({ addNote, newNote, handleNoteChange }) => {
  return(
    <form onSubmit={addNote} style={{ marginBottom: '20px' }}>
      <input 
        value={newNote}
        onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )
}

export default NoteForm

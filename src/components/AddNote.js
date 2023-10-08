import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

function AddNote(props) {
    let context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: '' })
    
    function handleTheAddNote(e) {
        e.preventDefault();
        addNote(note.title,note.description);
        setNote({title:"",description:"",tag:""})
        props.showAlert("Added Successfully","success");
    }
    function changeInput(e) {
        setNote({ ...note, [e.target.name]: e.target.value });
    }
    return (
        <div className="container my-3">
            <h1 style={{ borderBottom: '1px solid black', paddingBottom: '10px', textAlign: 'center' }}>Add Notes</h1>
            <form style={{ marginBottom: '10px' }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title}  onChange={changeInput} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={changeInput} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name='tag' value={note.tag}  onChange={changeInput} minLength={5} required />
                </div>
               
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleTheAddNote}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote

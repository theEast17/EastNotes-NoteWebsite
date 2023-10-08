import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext';

function NoteItems(props) {
    let context=useContext(noteContext);
    const {deleteNote}=context;
    const { note,updateNote } = props;
    return (
        <div className='col-md-3 my-2'>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                    <div>
                        <i className='far fa-trash-alt' style={{marginRight:'15px'}} onClick={()=>{deleteNote(note._id);  props.showAlert("Deleted Successfully","success"); }}></i>
                        <i className='far fa-edit' onClick={()=>{updateNote(note)}}></i>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default NoteItems

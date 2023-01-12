import { async } from "@firebase/util";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { loadNotes } from "../../helpers";
import { addNewEmptyNote, setActiveNote, savingNewNote, setNotes, setSaving } from "./";


export const startNewNote = () => {
    return async(dispatch, getState) => {
        console.log(getState())
        dispatch(savingNewNote())
        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime()
        }

        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`))
        await setDoc(newDoc, newNote);

        newNote.id = newDoc.id;

        dispatch(addNewEmptyNote(newNote))
        dispatch(setActiveNote(newNote))
    }
}

export const startLoadingNotes = () => {
    return async(dispatch, getState) => {
        // getState retorna el estado almacenado en redux
        const { uid } = getState().auth;
        if(!uid) throw new Error('El uid del usuario no existe');
        
        const notes = await loadNotes(uid)
        dispatch(setNotes(notes))
    }
}

export const startSaveNote = () => {
    return async(dispatch, getState) => {
        console.log(getState())
        dispatch(setSaving())
        const { uid } = getState().auth;
        const { active:note } = getState().journal;

        const noteToFireStore = {...note};

        // elimina la propiedad id
        delete noteToFireStore.id

        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
        await setDoc(docRef, noteToFireStore, { merge: true })

       
    }
}


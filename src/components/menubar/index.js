import {h} from 'preact';
import {actions, useHomePageContext} from "../../contexts/home";
import {useDbService} from "../../contexts/db";
import {useRef} from "preact/hooks";

const Menubar = () => {

    const inputFile = useRef(null);

    const {state: {activeDoc, rawValue}, dispatch} = useHomePageContext();
    const dbService = useDbService();

    // when saving the entire MD, we should replace the pasted images -
    // ![Pasted Image xxx](bid:${id}:url) with a standardized template -
    // ![Pasted Image xxx](bid:${id}:GENERATED_URL) so no temporary URL is persisted.
    const save = async (text, name) => {
        const doc = {
            ...activeDoc,
            name: name || activeDoc ? activeDoc.name : 'A' + Date.now(),
            data: text.replaceAll(/(\!\[.*\]\(bid:\d+:)(.*)(\))/gi, '$1GENERATED_URL$3'),
            lastModifiedAt: Date.now(),
        };

        return dbService.db.docs.put(doc);
    };

    const openNoteList = () => {
        dispatch({
            type: actions.OpenNoteList,
        })
    };

    const newNote = () => {
        dispatch({
            type: actions.NewNote,
        })
    };

    const triggerFileUpload = () => {
        dispatch({
            type: actions.CloseNoteList
        });
        inputFile.current.click();
    }

    const importDb = async () => {
        try {
            const file = inputFile.current.files[0];
            await dbService.importDb(file);
            dispatch({
                type: actions.ImportNotes
            });
        } catch (err) {
            console.error(err.name, err.message);
        }
    }

    const exportDb = async () => {
        dispatch({
            type: actions.CloseNoteList
        });
        await dbService.exportDb();
    }

    return (
        <div class="flex flex-wrap justify-between my-2">
            <div class="btn-group mb-1">
                <button onClick={newNote} class="btn">📝New</button>
                <button onClick={openNoteList} class="btn">📂Open</button>
                <button onClick={() => save(rawValue)} class="btn">💾Save</button>
            </div>
            <div class="btn-group">
                <button onClick={triggerFileUpload} class="btn">📥Import Local Notes</button>
                <button onClick={exportDb} class="btn">📤Export Local Notes</button>
            </div>
            <div className="hidden">
                <label htmlFor="file">📥Import Local Notes</label>
                <input ref={inputFile} id="file" type="file" onChange={importDb}/>
            </div>
        </div>
    )
};

export default Menubar;
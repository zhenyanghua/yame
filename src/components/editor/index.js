import {h} from 'preact';
import {actions, useHomePageContext} from "../../contexts/home";
import {useRef} from "preact/hooks";
import {useDbService} from "../../contexts/db";

const Editor = () => {
    const textarea = useRef(null);
    const {state: {rawValue}, dispatch} = useHomePageContext();
    const dbService = useDbService();
    const update = val => {
        dispatch({
            type: actions.UpdateMarkdown,
            payload: val
        });
    };
    const saveBlob = async blob => {
        return dbService.db.images.put({
            data: blob
        });
    };
    const onInput = e => {
      update(e.target.value);
    }
    const onPaste = async e => {
        const data = (await navigator.clipboard.read())
            .filter(item => item.types.includes('image/png'));

        for (const item of data) {
            const blob = await item.getType('image/png');
            // Save blob as users paste
            // TODO - need to remove those from idb and revoke URL when the current session or activeDoc is reset to undefined.
            const blobId = await saveBlob(blob);
            const url = URL.createObjectURL(blob);
            // find the cursor position and insert
            // FIXME - the "Cut" command doesn't seem to be working
            const val = rawValue.slice(0, textarea.current.selectionStart)
                + `![Image - ${new Date().toLocaleString('en-US')}](bid:${blobId}:${url})`
                + rawValue.slice(textarea.current.selectionStart + 1);
            update(val);
        }
    };
    return (
        <div class="w-full h-full">
            <label className="visually-hidden" htmlFor="editor">Editor</label>
            <textarea ref={textarea} value={rawValue} onInput={onInput} onPaste={onPaste} class="w-full h-full resize-none" id="editor"
                      placeholder="Open or start writing here"/>
        </div>
    )
}

export default Editor;
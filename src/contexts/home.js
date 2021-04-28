import {useContext} from "preact/hooks";
import {createContext} from "preact";

export const actions = {
    UpdateMarkdown: 'update-markdown',
    OpenNoteList: 'open-note-list',
    CloseNoteList: 'close-note-list',
    OpenNote: 'open-note',
    NewNote: 'new-note',
    ImportNotes: 'import-notes',
};

export const HomePageContext = createContext(null);

export const useHomePageContext = () => {
    const context = useContext(HomePageContext);
    if (context === null) {
        throw new Error('Must be used within the HomePage');
    }
    return context;
}
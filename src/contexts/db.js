import {createContext} from "preact";
import Dexie from 'dexie';
import {importInto, exportDB} from "../dexie-export-import.mjs";
import {useContext} from "preact/hooks";

class DbService {
    db;

    constructor() {
        this.db = new Dexie('markdown_notes');
        this.db.version(1).stores({
            images: '++id',
            docs: '++id, name, lastModifiedAt'
        });
    }

    async importDb(file) {
        return await importInto(this.db, file, {
            overwriteValues: true
        });
    }

    async exportDb() {
        const blob = await exportDB(this.db,{
            prettyJson: true
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = `Notes - ${new Date().toLocaleString('en-US')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

}

export default DbService;

export const DbServiceContext = createContext(null);

export const useDbService = () => {
    const context = useContext(DbServiceContext);
    if (context === null) {
        throw new Error('Must be used within the App');
    }
    return context;
};
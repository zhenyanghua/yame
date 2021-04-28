import {h} from 'preact';
import Menubar from "../../components/menubar";
import Editor from "../../components/editor";
import Preview from "../../components/preview";
import {useEffect, useMemo, useReducer, useState} from "preact/hooks";
import {actions, HomePageContext} from "../../contexts/home";
import Sidesheet from "../../components/sidesheet";
import {useDbService} from "../../contexts/db";

const initialState = {
    activeDoc: null,
    rawValue: '',
    sidesheetOpen: false
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.UpdateMarkdown:
            return {
                ...state,
                rawValue: action.payload
            };
        case actions.OpenNoteList:
            return {
                ...state,
                sidesheetOpen: true
            };
        case actions.CloseNoteList:
            return {
                ...state,
                sidesheetOpen: false
            }
        case actions.OpenNote:
            return {
                ...state,
                activeDoc: action.payload.doc,
                rawValue: action.payload.replacedData,
            }
        case actions.NewNote:
            return {
                ...state,
                activeDoc: null,
                rawValue: '',
                sidesheetOpen: false
            }
        case actions.ImportNotes:
            return {
                ...state,
                activeDoc: null,
                rawValue: '',
                sidesheetOpen: true,
            }
        default:
            throw new Error('Unexpected action');
    }
};

const Home = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const dbService = useDbService();
    const context = useMemo(() => ({
        state,
        dispatch
    }), [state]);

    const {sidesheetOpen, activeDoc} = state;

    const closeSideSheet = () => {
        dispatch({
            type: actions.CloseNoteList
        })
    }

    const renderSidesheet = () => {
        const [docs, setDocs] = useState([]);
        // Replace all matching patterns ![blob-id](GENERATED_URL) with the Pasted
        const openNote = async ({query, doc}) => {
            const selectedDoc = query ? await query : doc;
            const {data} = selectedDoc;
            const matches = Array.from(data.matchAll(/\!\[.*\]\(bid:(\d+):.*\)/gi));
            const imageIds = matches.map(m => {
                console.debug(m, m[1]);
                return Number(m[1])
            });
            const images = await dbService.db.images.bulkGet(imageIds);
            const replacedData = data.replaceAll(/(\!\[.*\]\(bid:(\d+):)(.*)(\))/gi, (m, p1, p2, p3, p4) => {
                const image = images.find(x => x.id === Number(p2));
                const url = URL.createObjectURL(image.data);
                return `${p1}${url}${p4}`;
            });
            dispatch({
                type: actions.OpenNote,
                payload: {
                    doc: selectedDoc,
                    replacedData
                }
            });
        }

        useEffect(() => {
            const getDocs = async () => {
                const data = await dbService.db.docs.orderBy('lastModifiedAt').reverse().sortBy('name');
                setDocs(data);
            }
            getDocs();
        });

        return (
            <Sidesheet title={"Open a note"} onClose={closeSideSheet}>
                <ul>
                    {docs.map(record =>
                        <li key={record.id}
                            class="hover:bg-purple-100 cursor-pointer"
                            onClick={() => openNote({doc: docs.find(doc => doc.id === record.id)})}>📝{record.name}<i>({new Date(record.lastModifiedAt).toLocaleString('en-US')})</i></li>)}
                </ul>
            </Sidesheet>
        )
    }

    return (
        <HomePageContext.Provider value={context}>
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="w-full h-full flex flex-col">
                    <Menubar/>
                    <Editor class="flex-grow-1"/>
                </div>
                <Preview/>
            </div>
            {sidesheetOpen && renderSidesheet()}
        </HomePageContext.Provider>
    );
}

export default Home;

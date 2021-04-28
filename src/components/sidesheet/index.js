import {h} from 'preact';

const Sidesheet = ({title, children, onClose}) => {
    return (
        <div
            class="w-80 absolute top-0 right-0 bg-white border-purple-300 border-solid border-l-2 border-r-2 px-4 p-content h-full">
            <h1 class="text-purple-700 text-xl mb-4">{title}</h1>
            <button onClick={onClose} class="btn absolute top-content right-4">❎Close</button>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Sidesheet;
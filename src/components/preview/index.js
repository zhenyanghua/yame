import {h} from 'preact';
import {useHomePageContext} from "../../contexts/home";
import marked from 'marked';
import 'github-markdown-css';

const Preview = () => {
    const {state: {rawValue}} = useHomePageContext();
    const html = marked(rawValue.replaceAll(/bid:\d+:/gi, ''));

    return (<div class="markdown-body p-1" dangerouslySetInnerHTML={{__html: html}}/>);
}

export default Preview;

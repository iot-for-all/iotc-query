import './json.scss';
import Editor from "@monaco-editor/react";

import React from 'react';

function Json({ data }: { data: any }) {

    const [jsonData, setJsonData] = React.useState<any>();

    React.useEffect(() => {
        setJsonData(JSON.stringify(data, null, 2));
    }, [data]);

    return <div className='json'>
        <Editor options={{
            renderLineHighlight: 'none',
            wordWrap: 'on',
            formatOnType: true,
            lineNumbers: 'off',
            minimap: { enabled: false },
            glyphMargin: false,
            disableLayerHinting: true,
            highlightActiveIndentGuide: false,
            matchBrackets: 'never',
            renderIndentGuides: false
        }}
            onChange={() => { }}
            language="json"
            defaultValue={jsonData}
            value={jsonData}
        />
    </div >
}

export default Json
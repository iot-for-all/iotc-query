import './tile.scss';

import React from 'react';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTextFieldStyles } from '../../styles/fluentStyles';

function TileConfig({ config, saveHandler, cancelHandler }: { config: any, saveHandler: any, cancelHandler: any }) {

    const [newConfig, setNewConfig] = React.useState(JSON.stringify(config, null, 2));

    const wideTile = config.size === undefined ? 0 : config.size === 1 ? true : false;

    return <div className={!wideTile ? 'tile tile-config' : 'tile tile-wide tile-config'}>
        <TextField label="Update Configuration" styles={getTextFieldStyles} multiline rows={8} value={newConfig} onChange={(e: any) => setNewConfig(e.target.value)} />
        <div className="btn-bar">
            <PrimaryButton onClick={() => saveHandler(JSON.parse(newConfig))}>Save</PrimaryButton>
            <DefaultButton onClick={() => cancelHandler()}>Cancel</DefaultButton>
        </div>
    </div >
}

export default TileConfig
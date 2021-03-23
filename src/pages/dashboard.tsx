import './pages.scss';

import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IconButton, Stack } from '@fluentui/react/lib/';

import Tile from './components/tile';
import TileConfig from './components/tileConfig';

import { DashboardContext } from '../context/dashboardContext';

export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Dashboard() {

    const dashboardContext: any = React.useContext(DashboardContext);
    const [editConfigIndex, setEditConfigIndex] = React.useState<any>(-1);
    const [polling, setPolling] = React.useState(false);

    const cmdBar: ICommandBarItemProps[] = React.useMemo(() => [{
        key: '1',
        text: 'Start polling',
        iconProps: {
            iconName: 'Play'
        },
        onClick: () => { setPolling(true) },
        disabled: polling

    }, {
        key: '2',
        text: 'Stop',
        iconProps: {
            iconName: 'Stop'
        },
        onClick: () => { setPolling(false) },
        disabled: !polling
    }], [polling]);

    const cmdBarFar: ICommandBarItemProps[] = React.useMemo(() => [{
        key: '1',
        text: 'Delete All',
        iconProps: {
            iconName: 'Delete'
        },
        onClick: () => dashboardContext.deleteAll()
        // eslint-disable-next-line
    }], []);

    const getTileConfig = (index: number) => {
        setEditConfigIndex(index);
    }

    const cancelTileConfig = () => {
        setEditConfigIndex(-1);
    }

    const saveTileConfig = (config: any) => {
        dashboardContext.updateTile(editConfigIndex, config);
        setEditConfigIndex(-1);
    }

    return <div className='workspace'>
        <div className='container action-bar'>
            <CommandBar items={cmdBar} farItems={cmdBarFar} className='of-command-bar' />
        </div>
        <div className='dashboard'>
            {dashboardContext.tiles && dashboardContext.tiles.map((tileConfig: any, index: number) => {
                const delay = getRndInteger(1, 10);
                return <div key={index} className='dashboard-tile'>
                    <div className='container header'>
                        <div>{tileConfig.title}</div>
                        <Stack tokens={{ childrenGap: 4 }} horizontal>
                            <IconButton onClick={() => getTileConfig(index)} iconProps={{ iconName: 'Settings' }} title="Settings" />
                            <IconButton onClick={() => dashboardContext.removeTile(index)} iconProps={{ iconName: 'Cancel' }} title="Delete" />
                        </Stack>
                    </div>
                    <div className='content'>
                        {editConfigIndex === index ? <TileConfig saveHandler={saveTileConfig} cancelHandler={cancelTileConfig} config={tileConfig} /> : <Tile config={tileConfig} polling={polling} pollingDelay={delay} />}
                    </div>
                </div>
            })}
        </div>
    </div>
}
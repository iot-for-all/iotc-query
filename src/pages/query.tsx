import './pages.scss';

import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IPivotItemProps, Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import FadeLoader from "react-spinners/FadeLoader";
import Editor from "@monaco-editor/react";

import { AuthContext } from '../context/authContext';
import { DashboardContext } from '../context/dashboardContext';

import usePromise from '../hooks/usePromise';
import Chart from './components/chart';
import Table from './components/table';
import Json from './components/json';
import Number from './components/number';

import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import axios from 'axios';

function makeAPICall(method: 'get' | 'post', url: string, body: any, accessToken: string) {
    return new Promise(async (resolve, reject) => {
        const config: any = { method, url, headers: { Authorization: 'Bearer ' + accessToken } }
        if (method === 'post') { config.data = body; }
        axios(config)
            .then((res) => { resolve(res); })
            .catch((err) => { reject(err); });
    });
}

function makeQuery(authContext: any, query: string) {
    return new Promise(async (resolve, reject) => {
        const accessToken = await authContext.getAccessToken();
        try {
            const res: any = await makeAPICall('post', `https://${authContext.applicationHost}/api/alpha/query`, { query }, accessToken);
            resolve(res.data);
        } catch (error) {
            reject(error.response.data.error.message);
        }
    });
}

export default function Query() {
    const authContext: any = React.useContext(AuthContext);
    const dashboardContext: any = React.useContext(DashboardContext);

    const [newQuery, setNewQuery] = React.useState("SELECT COUNT($ts) FROM dtmi:ns:interface;1");
    const [query, setQuery] = React.useState('');
    const [chart, setChart] = React.useState('json');

    const [queryLoading, queryResults, queryError, , executeQuery] = usePromise({ promiseFn: () => makeQuery(authContext, query) });

    const cmdBar: ICommandBarItemProps[] = [{
        key: '1',
        text: 'New',
        iconProps: {
            iconName: 'NewAnalyticsQuery'
        },
        onClick: () => setNewQuery('')

    }, {
        key: '2',
        text: 'Run',
        iconProps: {
            iconName: 'Play'
        },
        onClick: () => setQuery(newQuery)
    }, {
        key: '3',
        text: 'Revert',
        iconProps: {
            iconName: 'Undo'
        },
        onClick: () => setNewQuery(query)
    }, {
        key: '4',
        text: 'Cancel',
        iconProps: {
            iconName: 'Stop'
        }
    }];

    const cmdBarExport: ICommandBarItemProps[] = React.useMemo(() => [{
        key: '1',
        text: 'Export CSV',
        iconProps: {
            iconName: 'AnalyticsView'
        },
        onClick: () => { }
    }], []);

    const cmdBarVisualResults: IPivotItemProps[] = React.useMemo(() => [{
        itemKey: 'json',
        headerText: 'JSON',
        itemIcon: 'Code'
    }, {
        itemKey: 'table',
        headerText: 'Table',
        itemIcon: 'Table'
    }, {
        itemKey: 'line',
        headerText: 'Line',
        itemIcon: 'LineChart'
    }, {
        itemKey: 'pie',
        headerText: 'Pie',
        itemIcon: 'PieSingle'
    }, {
        itemKey: 'bar',
        headerText: 'Bar',
        itemIcon: 'BarChartVertical'
    }, {
        itemKey: 'gauge',
        headerText: 'Gauge',
        itemIcon: 'SpeedHigh'
    }, {
        itemKey: 'number',
        headerText: 'Number',
        itemIcon: 'NumberSymbol'
    }], []);

    React.useEffect(() => {
        if (query === '') { return; }
        executeQuery();
        // eslint-disable-next-line
    }, [query])

    const renderResults = () => {
        switch (chart) {
            case 'pie':
            case 'line':
            case 'bar':
            case 'gauge':
                return <Chart type={chart} data={queryResults.body} addHandler={addToDashboard} />
            case 'number':
                return <Number data={queryResults.body} addHandler={addToDashboard} />
            case 'table':
                return <Table data={queryResults.body} />
            default:
                return <Json data={queryResults.body} />
        }
    }

    const addToDashboard = (type: string) => {
        dashboardContext.addTile(type, query);
    }

    return <div className='workspace'>
        <div className='container action-bar'>
            <CommandBar items={cmdBar} />
        </div>

        <SplitterLayout primaryIndex={1} vertical={true} primaryMinSize={300} secondaryMinSize={80} secondaryInitialSize={150}>
            <div className="query-editor">
                <Editor options={{
                    renderLineHighlight: 'none',
                    wordWrap: 'on',
                    formatOnType: true,
                    lineNumbers: 'off',
                    minimap: { enabled: false },
                    glyphMargin: false,
                    disableLayerHinting: true,
                }}
                    onChange={(value: any) => setNewQuery(value)}
                    language="sql"
                    defaultValue={newQuery}
                    value={newQuery}
                />
            </div>
            <div className="query-results-container">
                <div className='action-bar'>
                    <Pivot onLinkClick={(item: any) => setChart(item.props.itemKey)} className='of-pivot'>
                        {cmdBarVisualResults && cmdBarVisualResults.map((item: IPivotItemProps) => {
                            return <PivotItem key={item.itemKey} itemKey={item.itemKey} headerText={item.headerText} itemIcon={item.itemIcon}></PivotItem>
                        })}
                    </Pivot>
                    <CommandBar items={cmdBarExport} />
                </div>

                <div className={chart === 'json' ? 'query-results-noscroll' : 'query-results'}>
                    {queryLoading ? <div className='workspace-loading'>Running query<br /><br /><FadeLoader /></div> :
                        queryError ? <div className='workspace-error'>{queryError}</div> :
                            queryResults ? <>
                                {renderResults()}
                            </>
                                : <div className='workspace-empty'>No results or waiting to Run query</div>
                    }
                </div>
            </div>
        </SplitterLayout>
    </div >
}
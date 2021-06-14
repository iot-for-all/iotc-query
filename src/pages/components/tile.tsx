import './tile.scss';

import React from 'react';
import axios from 'axios';
import usePromise from '../../hooks/usePromise';
import Chart from './chart';
import Number from './number';
import { AuthContext } from '../../context/authContext';
import FadeLoader from "react-spinners/FadeLoader";

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
            const res: any = await makeAPICall('post', `https://${authContext.applicationHost}/api/query?api-version=preview`, { query }, accessToken);
            resolve(res.data.results || res.data);
        } catch (error) {
            reject(error.message || error.response.data.error.message);
        }
    });
}

function Tile({ config, polling, pollingDelay }: { config: any, polling: boolean, pollingDelay: number }) {

    const authContext: any = React.useContext(AuthContext);
    const intervalRef = React.useRef<any>();

    // eslint-disable-next-line   
    const [adjustedQuery, setAdjustedQuery] = React.useState(config.query);
    const [fetchedResults, setFetchResults] = React.useState([]);
    const [time, setTime] = React.useState(config.refresh);

    // eslint-disable-next-line
    const [queryLoading, queryResults, queryError, ms, executeQuery] = usePromise({ promiseFn: () => makeQuery(authContext, adjustedQuery) });

    const wideTile = config.size === undefined ? 0 : config.size === 1 ? true : false;

    // Need to send the Chart size to C3 which cannot be done through CSS
    const tileSize = {
        width: wideTile ? 550 : 270,
        height: 240
    }

    // This is the main function to refresh the tile. As well as setting 
    // up the loop, it returns the Tile results immediately as a one off
    const startTimer = () => {
        let timer: any = null;
        timer = setInterval(() => {
            setTime((time: any) => time - 1 < 0 ? config.refresh : time - 1)
        }, 1000);
        intervalRef.current = timer;
        executeQuery();
    }

    // This is the initial render to start the Tile refresh loop
    React.useEffect(() => {
        startTimer();
        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        // eslint-disable-next-line
    }, [])

    // If the Dashboard changes polling requirements, reset the Tile timer
    React.useEffect(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        if (!polling) { return; }
        setTimeout(() => {
            startTimer();
        }, pollingDelay * 1000)
        // eslint-disable-next-line
    }, [pollingDelay, polling]);

    // This is the fetch instruction when the timer expires
    React.useEffect(() => {
        if (time === 0 && polling) {
            executeQuery();
        }
        // eslint-disable-next-line
    }, [time, polling])

    // After the data has been fetched, set the render data object
    React.useEffect(() => {
        if (queryResults) {
            setFetchResults(queryResults);
        }
    }, [queryResults])

    return <div className={!wideTile ? 'tile' : 'tile tile-wide'}>
        {queryLoading && !queryResults && fetchedResults.length === 0 ? <FadeLoader /> :
            <div className='tile-content'>
                {config.type === 'number' ?
                    <Number data={fetchedResults} addHandler={null} format={config.format || undefined} /> :
                    <Chart className='tile-chart' size={tileSize} type={config.type} data={fetchedResults} addHandler={null} />
                }
                <div className='tile-info'>
                    {!polling ? <span>Stopped</span> :
                        <>
                            <span>{ms}ms</span>
                            <span>{time} secs</span>
                        </>
                    }
                </div>
            </div>
        }
    </div >
}

export default Tile
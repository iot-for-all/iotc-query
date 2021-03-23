import './chart.scss';

import React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/';
import useTimer from '../../hooks/useTimer';

import c3 from 'c3';
import 'c3/c3.css';

function Chart({ className, size, type, data, addHandler }: { className?: string, size?: any, type: 'bar' | 'line' | 'pie' | 'gauge', data: any, addHandler: any }) {

    const c3Ref = React.useRef(null);
    const [c3Instance, setC3Instance] = React.useState<any>(null);
    const [chartData, setChartData] = React.useState([]);
    const [timerActive, callTimer] = useTimer(3000);

    React.useEffect(() => {
        createChart();
        return () => {
            if (c3Instance) {
                c3Instance.unload();
            }
        }
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        const keyIndex: any = {};
        const cols: any = [];
        data.forEach((element: any) => {
            for (const key in element) {
                if (key === '$ts') { continue; }
                if (keyIndex[key] === undefined) {
                    cols.push([key])
                    keyIndex[key] = cols.length - 1;
                }
                cols[keyIndex[key]].push(element[key]);
            }
        })
        setChartData(cols);
    }, [data]);

    React.useEffect(() => {
        createChart(chartData);
        // eslint-disable-next-line
    }, [type])

    React.useEffect(() => {
        renderChart(chartData);
        // eslint-disable-next-line
    }, [chartData]);

    const createChart = (data?: any) => {
        const options: any = {
            bindto: c3Ref.current,
            data: { columns: data || [], type: type },
            grid: { y: { show: true } }
        }
        if (size) { options['size'] = size }
        setC3Instance(c3.generate(options));
    }

    const renderChart = (renderData: any) => {
        if (chartData.length > 0) {
            c3Instance.load({
                columns: renderData
            });
        }
    }

    const handler = () => {
        callTimer();
        addHandler(type);
    }

    return <><div className={className || 'chart'}>
        <div ref={c3Ref}></div>
    </div>
        {!addHandler ? null :
            <div style={{ textAlign: 'center' }}>
                <br />
                <PrimaryButton onClick={() => handler()} text="Add this to the Dashboard" />
                {!timerActive ? null :
                    <>
                        <br /><br />
                        <strong>Added to Dashboard</strong>
                    </>
                }
            </div>
        }
    </>
}

export default Chart
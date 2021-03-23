import './number.scss';

import React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/';
import useTimer from '../../hooks/useTimer';

function Number({ data, addHandler, format }: { data: any, addHandler: any, format?: 'floor' | 'round' }) {

    const [number, setNumber] = React.useState('');
    const [timerActive, callTimer] = useTimer(3000);

    React.useEffect(() => {
        let value: any = '???';
        try {
            value = data[0][Object.keys(data[0])[0]];
            if (format) { value = Math[format](parseFloat(value)); }
        }
        catch { }
        setNumber(value);
        // eslint-disable-next-line
    }, [data]);

    const handler = () => {
        callTimer();
        addHandler('number');
    }
    return <><div className='number'>
        <h1>{number}</h1>
    </div >
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

export default Number
import * as React from 'react';

const useTimer = ((ms: number): Array<any> => {
    const [activated, setActivated] = React.useState<boolean>(false);

    const callTimer = () => {
        setActivated(true)
        setTimeout(() => {
            setActivated(false);
        }, ms)
    };

    return [activated, callTimer];
})

export default useTimer
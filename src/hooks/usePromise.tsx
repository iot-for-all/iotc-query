import * as React from 'react';

const usePromise = ({ promiseFn }: { promiseFn: any }) => {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<any>(null);
    const [error, setError] = React.useState(null);
    const [ms, setMs] = React.useState<any>();

    const callPromise = async () => {
        setLoading(true);
        setData(null);
        setError(null);
        try {
            const start = new Date().getTime();
            const res = await promiseFn();
            setData(res);
            setMs(new Date().getTime() - start);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };

    return [loading, data, error, ms, callPromise];
};

export default usePromise
import './table.scss';

import React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react/lib/DetailsList'

function Table({ data }: { data: any }) {

    const [tableData, setTableData] = React.useState({ rows: [], cols: [] });

    React.useEffect(() => {
        const keyFound: any = {};
        const cols: any = [];
        const rows: any = [];

        data.forEach((element: any) => {
            for (const key in element) {
                if (keyFound[key] === undefined) {
                    cols.push({
                        key: key,
                        name: key,
                        fieldName: key
                    })
                    keyFound[key] = true;
                }
            }
            rows.push(element);
        })
        setTableData({ rows, cols });
    }, [data]);

    return <div className='table'> <DetailsList
        compact={true}
        items={tableData.rows}
        columns={tableData.cols}
        selectionMode={SelectionMode.none}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
    />
    </div >
}

export default Table
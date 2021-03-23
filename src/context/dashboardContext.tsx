import * as React from 'react';

const KEY = 'QueryTiles'

export const DashboardContext = React.createContext({});

export class DashboardProvider extends React.PureComponent {

    constructor(props: any) {
        super(props);
        const cache: any = localStorage.getItem(KEY);
        this.state.tiles = JSON.parse(cache || '[]');
    }

    addTile = (type: string, query: string) => {
        const t = this.state.tiles.slice();
        t.push({ title: `${type} Chart ${t.length + 1}`, type, query, size: 0, refresh: 10 })
        setTimeout(() => {
            localStorage.setItem(KEY, JSON.stringify(this.state.tiles))
        }, 250);
        this.setState({ tiles: t });
    }

    updateTile = (index: number, config: any) => {
        const t = this.state.tiles.slice();
        t[index] = config;
        setTimeout(() => {
            localStorage.setItem(KEY, JSON.stringify(this.state.tiles))
        }, 250);
        this.setState({ tiles: t });
    }

    removeTile = (index: number) => {
        const t = this.state.tiles.slice();
        t.splice(index, 1);
        setTimeout(() => {
            localStorage.setItem(KEY, JSON.stringify(this.state.tiles))
        }, 250);
        this.setState({ tiles: t });
    }

    deleteAll = () => {
        setTimeout(() => {
            localStorage.setItem(KEY, JSON.stringify(this.state.tiles))
        }, 250);
        this.setState({ tiles: [] });
    }

    state: any = {
        tiles: [],
        addTile: this.addTile,
        removeTile: this.removeTile,
        updateTile: this.updateTile,
        deleteAll: this.deleteAll
    }

    render() {
        return (
            <DashboardContext.Provider value={this.state}>
                {this.props.children}
            </DashboardContext.Provider>
        )
    }
}
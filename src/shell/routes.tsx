import { Switch, Route } from 'react-router-dom';
import Query from '../pages/query';
import Dashboard from '../pages/dashboard';
import Central from '../pages/central';

export const Paths = {
    dashboard: {
        index: '/',
    },
    query: {
        index: '/query',
    },
    central: {
        index: '/central',
    }
};

export function Routes({ application }: { application: string }) {
    return (
        <Switch>
            <Route exact path={Paths.dashboard.index} component={Dashboard} />
            <Route path={Paths.query.index} component={Query} />
            <Route path={Paths.central.index} component={Central} />
        </Switch>
    );
}
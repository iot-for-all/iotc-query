import classnames from 'classnames/bind';

import { Paths } from './routes';
import { NavLink } from 'react-router-dom';
import { FontIcon } from '@fluentui/react/lib/Icon';

const cx = classnames.bind(require('./shell.scss'));

export function Navigation() {
    return (
        <>
            <NavItem to={Paths.dashboard.index} exact title='View saved queries' icon='ViewDashboard' text='Dashboard' />
            <NavItem to={Paths.query.index} exact title='Build a query and pin to the dashboard' icon='AnalyticsQuery' text='Build a query' />
            <NavItem to={Paths.central.index} exact title='Go to your IoT Central application' icon='AppIconDefault' text='IoT Central app' />
        </>
    );
}

function NavItem({ to, exact, title, icon, text }: {
    to: string;
    exact?: boolean;
    title: string;
    icon: string;
    text: string;
}) {
    return (
        <NavLink to={to} exact={exact} title={title} className='global-nav-item' activeClassName='global-nav-item-active'>
            <FontIcon iconName={icon} className='global-nav-item-icon' />
            <span className={cx('inline-text-overflow', 'global-nav-item-text')}>{text}</span>
        </NavLink>
    );
}
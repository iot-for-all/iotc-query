import './shell.scss';

import React from 'react';

import { AuthContext } from '../context/authContext';
import { Shell as FluentShell, NavigationProperties } from '@microsoft/azure-iot-ux-fluent-controls/lib/components/Shell';
import { Navigation } from './navigation';
import { Routes } from './routes';
import { FontIcon } from '@fluentui/react/lib/Icon';

function signOut(signOutHandler: any) {
  return <div className='sign-out'>
    <button title='Sign Out' onClick={signOutHandler}><FontIcon iconName='SignOut' className='global-nav-item-icon' /></button>
  </div>
}

function Shell() {
  const authContext: any = React.useContext(AuthContext);
  const [expanded, setExpanded] = React.useState(true);

  const nav: NavigationProperties = {
    isExpanded: expanded,
    onClick: (() => setExpanded(!expanded)),
    children: <Navigation />
  }

  React.useEffect(() => {
    if (!authContext.authenticated && authContext.directoryId !== '') {
      authContext.signIn();
    }
  }, [authContext, authContext.authenticated]);

  return <div className="shell">
    <FluentShell
      masthead={{
        branding: "Public Query API" + (authContext.applicationHost !== '' ? 'for application - ' + authContext.applicationHost : ''),
        user: signOut(authContext.signOut)
      }}
      navigation={nav}>
      <Routes application={`http://${authContext.applicationHost}`} />
      {authContext.authenticated ? null : <div className='no-auth'>Not authenticated</div>}
    </FluentShell>
  </div >
}

export default Shell;

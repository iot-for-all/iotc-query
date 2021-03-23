import './pages.scss';
import React from 'react';
import { AuthContext, AppConfig } from '../context/authContext';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { TextField } from '@fluentui/react/lib/TextField';
import { getTextFieldStyles } from '../styles/fluentStyles';

export default function Dashboard() {

    const authContext: any = React.useContext(AuthContext);

    const [form, setForm] = React.useState<AppConfig>({
        applicationId: authContext.applicationId,
        directoryId: authContext.directoryId,
        applicationHost: authContext.applicationHost
    })

    const cmdBar: ICommandBarItemProps[] = [{
        key: '1',
        text: 'Save',
        iconProps: {
            iconName: 'Save'
        },
        onClick: () => { authContext.resetApplication(form) }
    }, {
        key: '2',
        text: 'Reset settings and clear local storage',
        iconProps: {
            iconName: 'RevToggleKey'
        },
        onClick: () => { authContext.clearApplication() }
    }];

    const updateForm = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const url = `https://${form.applicationHost}`;

    return <div className='workspace'>
        <div className='container action-bar'>
            <CommandBar items={cmdBar} className='of-command-bar' />
        </div>
        <div className='central'>
            <h1>Setup the IoT Central application</h1>
            <p>You will need to provide an Azure Active Directory Application to gain access to your IoT Central application. To set one up follow the instructions <a href='https://github.com/iot-for-all/iot-central-aad-setup'>here</a>.</p>
            <p>If you already have an AAD application complete the following form and Save. Once this form is completed you will be asked to sign-in.</p>
            <p>Use the same credentials you would use to sign-in to the IoT Central application being configured.</p>
            <div className='text-field'><TextField styles={getTextFieldStyles} label="AAD Application ID" name='applicationId' value={form.applicationId} onChange={updateForm} /></div>
            <div className='text-field'><TextField styles={getTextFieldStyles} label="AAD Directory ID" name='directoryId' value={form.directoryId} onChange={updateForm} /></div>
            <div className='text-field'><TextField styles={getTextFieldStyles} label="IoT Central application host" name='applicationHost' value={form.applicationHost} onChange={updateForm} /></div>
            {form.applicationHost === '' ? null :
                <>
                    <br />
                    <p>Go to the IoT Central application</p>
                    <a href={url} target='_blank' rel='noreferrer'>{url}</a>
                </>
            }
        </div>
    </div>
}
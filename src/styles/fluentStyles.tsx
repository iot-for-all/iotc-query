import { ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react/lib/TextField';

// this is required to style Office Fabric
export function getTextFieldStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    return {
        fieldGroup: [{
            border: (props.focused ? '1px solid #136bfb' : '1px solid #cdcdcd'),
            selectors: {
                ":hover": {
                    borderColor: '#136bfb',
                },
                ":focused": {
                    border: '1px',
                }
            }
        }]
    };
}
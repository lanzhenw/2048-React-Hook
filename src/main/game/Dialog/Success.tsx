import { ContextualMenu, DefaultButton, Dialog, DialogFooter, DialogType, Icon, PrimaryButton, Text } from 'office-ui-fabric-react'
import React from 'react'
import style from "./Dialog.module.css"

interface IProps {
    showDialog: boolean,
    closeDialog: () => void,
    logScore: () => void,
}
const Success: React.FunctionComponent<IProps> = ({
    showDialog, closeDialog, logScore
}) => {

    const dragOptions = {
        moveMenuItemText: "Move",
        closeMenuItemText: "Close",
        menu: ContextualMenu,
    }

    const themeColor:string = "rgb(239,79,117)"

    return (
        <Dialog
            hidden={!showDialog}
            maxWidth={400}
            minWidth={300}
            onDismiss={closeDialog}
            dialogContentProps={{
                type: DialogType.close,
                showCloseButton: true,
                title: "Congratulations!"
            }}
            modalProps={{
                isBlocking: true,
                styles: { main: { maxWidth: 450 } },
                dragOptions: dragOptions
            }}
        >
            <div className={style.content}>
                <Icon iconName="SkypeCheck" className={style.checkIcon} styles={{root: {color: themeColor}}}/>
                <Text variant="medium" className={style.text}>
                    Woohoo! You reached 2048! I bet you can't do 4096. Do you want to try?
                </Text>
            </div>
            <DialogFooter>
                <PrimaryButton onClick={closeDialog} text="Yes, let me continue" styles={{root: {backgroundColor: themeColor}}}/>
                <DefaultButton onClick={logScore} text="No, log my score"/>
            </DialogFooter>
        </Dialog>
    )
    
}

export default Success
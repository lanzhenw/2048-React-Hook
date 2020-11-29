import { Text, DefaultButton, Dialog, DialogFooter, DialogType, Icon, ContextualMenu, PrimaryButton } from "office-ui-fabric-react"
import React from "react"
import style from "./Dialog.module.css"
interface IProps {
    hideDialog: boolean,
    logScore: () => void,
    closeDialog: () => void,
    hasWon: boolean,
    onRefresh: () => void
}

export const GameEnding: React.FunctionComponent<IProps> = ({
    hideDialog,
    hasWon,
    logScore,
    closeDialog,
    onRefresh
}) => {
    const dragOptions = {
        moveMenuItemText: "Move",
        closeMenuItemText: "Close",
        menu: ContextualMenu
    }

    return (
        <Dialog
            hidden={hideDialog}
            maxWidth={400}
            minWidth={300}
            onDismiss={closeDialog}
            dialogContentProps={{
                type: DialogType.close,
                showCloseButton: true,
                title: "Game Over"
            }}
            modalProps={{
                isBlocking: true,
                styles: { main: { maxWidth: 400 } },
                dragOptions: dragOptions
            }}
        >
            <div className={style.content}>
                <Icon
                    iconName= {hasWon ? "Medal" : "Sad"}
                    className={style.warningIcon}
                    styles={{ root: { color:  "#FFC300"} }}
                />
                <Text variant="mediumPlus" className={style.text}>
                    {hasWon ? "Good job! Do you want to log your record?" : "There is no way to move. Game ended."}
                </Text>
            </div>
            <DialogFooter>
                {hasWon ? 
                (<PrimaryButton onClick={logScore} text="Log my score" styles={{ root: { backgroundColor:  "#FFC300"} }}/>) 
                : <PrimaryButton onClick={onRefresh} text="Start a new game" styles={{ root: { backgroundColor:  "#FFC300"} }}/>}
                <DefaultButton onClick={closeDialog} text="Cancel" />   
                
            </DialogFooter>
        </Dialog>
    )
}
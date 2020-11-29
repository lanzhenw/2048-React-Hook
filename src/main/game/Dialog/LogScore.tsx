import { ContextualMenu, Text, DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton, Stack, TextField, Spinner, SpinnerSize, IRefObject, ITextField } from 'office-ui-fabric-react'
import React, { useRef, useState } from 'react'
import style from "./Dialog.module.css"

interface IProps {
    hideDialog: boolean,
    isProcessing: boolean,
    closeDialog: () => void,
    onSubmit: (input: string | undefined) => void,
    score: number,
    forwardRef: React.RefObject<ITextField> 
}

const LogScore: React.FunctionComponent<IProps> = ({hideDialog, isProcessing, closeDialog, onSubmit, score, forwardRef}) =>{
    
    
    const dragOptions = {
        moveMenuItemText: 'Move',
        closeMenuItemText: 'Close',
        menu: ContextualMenu,
      };
      const modalPropsStyles = { main: { maxWidth: 450 } };
      const dialogContentProps = {
        type: DialogType.normal,
        title: 'Winner Board',
        subText: '',
      };
    const modalProps = {
        isBlocking: true,
        styles: modalPropsStyles,
        dragOptions: dragOptions
    }

    const getErrorMessage = (input: string): string => {
        return input.trim() === "" 
            ? "Name cannot be blank" 
            : ""
    }

    return (
        <Dialog
        hidden={hideDialog}
        onDismiss={closeDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <Stack 
            horizontal={false} tokens={{childrenGap: 20}}
            styles={{root: {width: "100%"}}} > 
            <Text variant="xLarge">Your final score is {score}</Text>
            <TextField 
                key="name"
                label="Name" 
                componentRef={forwardRef}
                validateOnLoad={false}
                // validateOnFocusIn
                validateOnFocusOut
                onGetErrorMessage={getErrorMessage}
                data-testid="name"/>
        </Stack>
        <DialogFooter>
          <PrimaryButton 
            onClick={() => onSubmit(forwardRef.current ? forwardRef.current.value : "")} 
            text="Submit"
            disabled={isProcessing}
            >
              { isProcessing && (<Spinner
                size={SpinnerSize.small}
                className={style.spinner} />)}
            </PrimaryButton>
          <DefaultButton onClick={closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    )
}

export default LogScore
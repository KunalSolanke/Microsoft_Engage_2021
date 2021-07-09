import { ComposedModal, ModalBody, ModalFooter, ModalHeader } from 'carbon-components-react'
import React from 'react'
import { useContext } from 'react'
import { SocketContext } from '../../context/GlobalSocketContext'

function LeaveMeet({onCancel,onConfirm}) {
    const context = useContext(SocketContext)
    const handleConfirm = ()=>{
        context.leaveCall()
        onConfirm();
    }
    return (
        <div>
             <ComposedModal open={true} onClose={onCancel} onRequest>
                <ModalHeader label="Meeting" title="Leaving meet" />
                <ModalBody hasForm hasScrollingContent>
                    <p style={{ marginBottom: '1rem' }}>
                    Are you sure you want to leave the m meeting?
                    </p>
                </ModalBody>
                <ModalFooter primaryButtonText="Confirm" secondaryButtonText="Cancel" onRequestClose={onCancel} onRequestSubmit={()=>handleConfirm()} />
                </ComposedModal>
            
        </div>
    )
}

export default LeaveMeet

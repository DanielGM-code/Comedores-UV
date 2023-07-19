import React from 'react'
import Modal from '../components/Modal'
import '../utils/formatting'

const ConfirmModal = ({ 
    cancelAction, 
    isShowingModal, 
    setIsShowingModal, 
    object 
}) => {

    return (
        <>
            <Modal 
                title={'Venta realizada'}
                isShowing={isShowingModal}
                setIsShowing={setIsShowingModal}
                onClose={() => {
                    cancelAction()
                }}
            >
                <div className='confirm-modal-body'>
                    <h4>Su cambio es de:</h4>

                    <h5>${object.change.priceFormat()}</h5>
                </div>
                
                <div className='modal-footer'>
                    <button 
                        type='button' 
                        className='btn btn-primary' 
                        onClick={() => {
                            cancelAction()
                            setIsShowingModal(false)
                            document.body.style.position = null
                        }}
                    >
                        Aceptar
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default ConfirmModal
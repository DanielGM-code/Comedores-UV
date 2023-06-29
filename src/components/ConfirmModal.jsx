import React from 'react'
import Modal from '../components/Modal'

const ConfirmModal = ({ cancelAction, isShowingModal, setIsShowingModal, typeClass }) => {

    return (
        <>
            <Modal 
                title={`¿Deseas cancelar el registro de ${typeClass}?`}
                isShowing={isShowingModal}
                setIsShowing={setIsShowingModal}
                onClose={() => {
                    setIsShowingModal(false)
                }}
            >
                <button
					type='button'
					className='btn btn-danger'
					onClick={() => {
						setIsShowingModal(false)
					}}
				>
					Regresar
				</button>
				<button type='button' className='btn btn-primary' onClick={() => {
					cancelAction()
					setIsShowingModal(false)
				}}>
					Aceptar
				</button>
            </Modal>
        </>
    )
}

export default ConfirmModal
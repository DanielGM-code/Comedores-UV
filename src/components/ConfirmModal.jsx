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
                    document.body.style.position = 'hidden'
                }}
            >
                <button
					type='button'
					className='btn btn-danger'
					onClick={() => {
						setIsShowingModal(false)
                        document.body.style.position = 'hidden'
					}}
				>
					Regresar
				</button>
				<button type='button' className='btn btn-primary' onClick={() => {
					cancelAction()
					setIsShowingModal(false)
                    document.body.style.position = null
				}}>
					Aceptar
				</button>
            </Modal>
        </>
    )
}

export default ConfirmModal
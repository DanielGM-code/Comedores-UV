import React, { useState } from 'react'
import Modal from '../components/Modal'
import { useQueryClient } from 'react-query'
import ConfirmModal from './ConfirmModal'

const DeleteModal = ({ objectClass, deleteMutation, cancelAction, isShowingModal, setIsShowingModal, typeClass}) => {

    const queryClient = useQueryClient()
	const [isShowingDeleteModal, setIsShowingDeleteModal] = useState(false)

    async function deleteObject(){
		await deleteMutation.mutateAsync(objectClass.id)
		queryClient.resetQueries()
		setIsShowingDeleteModal(true)
	}

    return (
        <>
            <Modal 
                title={`¿Deseas eliminar el ${typeClass} seleccionado?`}
                isShowing={isShowingModal}
                setIsShowing={setIsShowingModal}
                onClose={() => {
                    cancelAction()
                }}
            >
                <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => {
                        cancelAction()
                    }}
                >
                    Regresar
                </button>

                <button 
                    type='button' 
                    className='btn btn-primary' 
                    onClick={deleteObject}
                >
                    Aceptar
                </button>
            </Modal>

            <ConfirmModal
                cancelAction={cancelAction}
                typeModal={4}
                isShowingModal={isShowingDeleteModal}
                setIsShowingModal={setIsShowingDeleteModal}
                typeClass={typeClass}
            />
        </>
    )
}

export default DeleteModal
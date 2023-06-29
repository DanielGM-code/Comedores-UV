import React from 'react'
import Modal from '../components/Modal'
import { useQueryClient } from 'react-query'

const DeleteModal = ({ objectClass, deleteMutation, cancelAction, isShowingModal, setIsShowingModal, typeClass, isDelete}) => {

    const queryClient = useQueryClient()

    async function deleteObject(){
		await deleteMutation.mutateAsync(objectClass.id)
		await queryClient.resetQueries()
        cancelAction()
	}

    async function updateObject(){
        await deleteMutation.mutateAsync(objectClass)
        deleteMutation.reset()
        await queryClient.resetQueries()
        cancelAction()
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
                    onClick={isDelete ? deleteObject : updateObject}
                >
                    Aceptar
                </button>
            </Modal>
        </>
    )
}

export default DeleteModal
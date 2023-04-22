import React from 'react'
import Modal from '../components/Modal'

const ConfirmModal = ({ cancelAction, typeModal, isShowingModal, setIsShowingModal, typeClass }) => {

	function showButtonAcept(){
		if(typeModal === 4){
			return (
				<>
					<button type='button' className='btn btn-primary' onClick={() => {
						cancelAction()
						setIsShowingModal(false)
					}}>
						Aceptar
					</button>
				</>
			)
		}else{
			return (
				<>
					<button type='button' className='btn btn-primary' onClick={cancelAction}>
						Aceptar
					</button>
				</>
			)
		}
	}

    function showBodyModal(){
		if(typeModal === 1){
			return (
				<>
					<div>
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => {
								setIsShowingModal(false)
							}}
						>
							Regresar
						</button>
						{showButtonAcept()}
					</div>
				</>
			)
		}else{
			return (
				<>
					<p>
						{`${(typeModal === 2) ? `Se ha guardado el ${typeClass} correctamente.` 
							: (typeModal === 3) ? `Se ha actualizado el ${typeClass} correctamente` 
							: (typeModal === 4) ? `Se ha eliminado el ${typeClass} correctamente` 
							: 'Ha ocurrido un problema con la conexión a la base de datos. Revise en la sección de ayuda.'}`}
					</p>
					{showButtonAcept()}
				</>
			)
		}
	}

    return (
        <>
            <Modal 
                title={`${(typeModal === 1) ? '¿Deseas cancelar el registro?' 
                    : (typeModal  === 2) ? 'Registro guardado'
					: (typeModal === 3) ? 'Registro actualizado' 
					: (typeModal === 4) ? 'Registro eliminado'
                    : 'Error de conexión'}`}
                isShowing={isShowingModal}
                setIsShowing={setIsShowingModal}
                onClose={() => {
                    if(typeModal === 1){
						setIsShowingModal(false)
					}else if(typeModal === 4){
						cancelAction()
						setIsShowingModal(false)
					}else{
						cancelAction()
					}
                }}
            >
                {showBodyModal()}
            </Modal>
        </>
    )
}

export default ConfirmModal
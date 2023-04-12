import React from 'react'
import { useState } from 'react'
import FormField from '../components/FormField'
import { useMutation, useQueryClient } from 'react-query'
import { createArticleMutation, CREATE_MUTATION_OPTIONS, updateArticleMutation, UPDATE_MUTATION_OPTIONS } from '../utils/mutations'

const ArticleForm = ({ cancelAction, articleUpdate }) => {
    const [article, setArticle] = useState(articleUpdate ?? {
        descripcion: '',
        unidades: '',
        udm: '',
        precio: '',
        partida: ''
    })
    const queryClient = useQueryClient()
    const createMutation = useMutation(createArticleMutation, {
        ...CREATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('articles')
        }
    })

    const updateMutation = useMutation(updateArticleMutation, {
        ...UPDATE_MUTATION_OPTIONS,
        onSettled: async () => {
            queryClient.resetQueries('articles')
        }
    })

    function handleInputChange(event) {
        setArticle(prevArticle => {
            return {
                ...prevArticle,
                [event.target.name]: event.target.value
            }
        })
    }

    async function submitArticle() {
        if(article.id) {
            await updateMutation.mutateAsync(article)
            updateMutation.reset()
        }else {
            await createMutation.mutateAsync(article)
            createMutation.reset()
        }
        await queryClient.resetQueries()

        cancelAction()
    }

    return(
        <form>
            <FormField
				name='descripcion'
				inputType='text'
				iconClasses='fa-solid fa-memo'
				placeholder='Descripción'
				value={article.descripcion}
				onChange={handleInputChange}
			/>
			<FormField
				name='unidades'
				inputType='number'
				iconClasses='fa-solid fa-hashtag'
				placeholder='Unidades'
				value={article.unidades}
				onChange={handleInputChange}
			/>
			<FormField
				name='udm'
				inputType='text'
				iconClasses='fa-solid fa-burger-soda'
				placeholder='UDM'
				value={article.udm}
				onChange={handleInputChange}
			/>
			<FormField
				name='precio'
				inputType='number'
				iconClasses='fa-solid fa-circle-dollar-to-slot'
				placeholder='Precio'
				value={article.precio}
				onChange={handleInputChange}
			/>
            <FormField
				name='partida'
				inputType='text'
				iconClasses='fa-solid fa-basket-shopping'
				placeholder='Descripción'
				value={article.partida}
				onChange={handleInputChange}
			/>
            <div className='modal-footer'>
				<button
					type='button'
					className='btn btn-danger'
					onClick={cancelAction}
				>
					Cancelar
				</button>
				<button
					type='button'
					className='btn btn-primary'
					onClick={submitArticle}
				>
					{`${article.id ? 'Actualizar' : 'Guardar'}`}
				</button>
			</div>
        </form>
    )
}

export default ArticleForm
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { datatableOptions } from '../utils/datatables'
import { readAllArticles } from '../data-access/articleDataAccess'
import $ from 'jquery'
import Modal from '../components/Modal'
import ArticleForm from '../forms/ArticleForm'
import { deleteArticleMutation, DELETE_MUTATION_OPTIONS } from '../utils/mutations' 
import { QUERY_OPTIONS } from '../utils/useQuery'
import 'datatables.net-buttons/js/buttons.print.js'

const Articles = ({ cancelAction, idOutcome }) => {
    const { data: articles, isLoading } = useQuery({
        ...QUERY_OPTIONS,
        queryKey: 'articles',
        queryFn: readAllArticles(idOutcome)
    })
    const [isShowingModal, setIsShowingModal] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState(null)
    const queryClient = useQueryClient()
    const tableRef = useRef()

    const deleteMutation = useMutation(deleteArticleMutation, DELETE_MUTATION_OPTIONS)

    useEffect(() => {
        const table = $(tableRef.current).DataTable(datatableOptions)
        table.draw()
    }, [articles])

    async function onDeleteButtonClicked (id) {
        await deleteMutation.mutateAsync(id)
        queryClient.resetQueries()
    }

    return (
        <>
            {isLoading ? 'Loading' :
                <>
                    <button
						type='button'
						className='btn-registrar'
						onClick={() => setIsShowingModal(true)}
					>
                        <i className='fa-solid fa-plus'></i> Nuevo artículo
                    </button>
                    <div className='contenedor-tabla'>
                        <h3>Artículos</h3>
                        <table ref={tableRef} className='table table-hover table-borderless'>
                            <thead>
                                <tr>
                                <th className='leading-row'>Descripción</th>
									<th>Unidades</th>
									<th>UDM</th>
									<th>Precio</th>
                                    <th>Partida</th>
									<th className='trailing-row'>Opciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {articles.map(article =>
                                    <tr key={article.id}>
                                        <td className='leading-row'>{article.descripcion}</td>
                                        <td>{article.unidades}</td>
                                        <td>{article.udm}</td>
                                        <td>{article.precio}</td>
                                        <td>{article.partida}</td>
                                        <td className='trailing-row'>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													setSelectedArticle(article)
													setIsShowingModal(true)
												}}
											>
												<i className='fa-solid fa-pen-to-square'></i>
											</button>
											<button
												type='button'
												className='btn-opciones p-1'
												onClick={() => {
													onDeleteButtonClicked(article.id)
												}}
											>
												<i className='fa-solid fa-trash'></i>
											</button>
										</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type='button'
                        className='btn btn-danger'
                        onClick={cancelAction}
                    >
                        Cerrar
                    </button>
                </>
            }
            <Modal
				title={`${selectedArticle ? 'Actualizar' : 'Registrar Nuevo'} Artículo`}
				isShowing={isShowingModal}
				setIsShowing={setIsShowingModal}
				onClose={() => {
					setSelectedArticle(null)
				}}
			>
				<ArticleForm
					cancelAction={() => {
						setSelectedArticle(null)
						setIsShowingModal(false)
					}}
					articleUpdate={selectedArticle}
				/>
			</Modal>
        </>
    )
}

export default Articles
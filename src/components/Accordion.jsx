import '../css/accordion.css'

const Accordion = ({ 
    title, 
    content, 
    id 
}) => {

    return (
        <>
            <div id="accordion">
                <div className="card">
                    <div 
                        className="card-header collapsed" 
                        role='button' 
                        data-toggle="collapse" 
                        data-target={`#${id}`} 
                        aria-expanded="false" 
                        aria-controls={id} 
                        id="headingOne"
                    >
                        <h5 className="mb-0">
                            <button 
                                className="btn collapsed" 
                                data-toggle="collapse" 
                                data-target={`#${id}`} 
                                aria-expanded="false" 
                                aria-controls={id}
                            >
                                {title}
                            </button>
                        </h5>
                    </div>

                    <div 
                        id={id} 
                        className="collapse" 
                        aria-labelledby="headingOne"
                    >
                        <div className="card-body">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Accordion
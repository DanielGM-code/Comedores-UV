import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import '../css/muiComponent.css'

const AccordionHelp = ({ question, answer }) => {
    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<i className="fa-solid fa-chevron-down"></i>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {question}
                </AccordionSummary>
                <AccordionDetails>
                    {answer}
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AccordionHelp
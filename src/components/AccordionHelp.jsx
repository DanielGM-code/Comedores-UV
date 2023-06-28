import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import '../css/accordion.css';

const AccordionHelp = ({ title, content }) => {
    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<i className="fa-solid fa-chevron-down"></i>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    {title}
                </AccordionSummary>
                <AccordionDetails>
                    {content}
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AccordionHelp
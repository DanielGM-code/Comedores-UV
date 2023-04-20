import React from 'react';


function PrintButton({order, orderDetails, payment}){
    const handlePrint = () =>{
        const printData = { order, orderDetails};
        const printWindow = window.open('','', 'height=500,width=500');
        printWindow.document.write(`<html><head><title>Ticket de orden</title></head><body><pre>${JSON.stringify(printData, null, 2)}</pre></body></html>`)
        printWindow.print();
        printWindow.close();
    };
    return(
        <button className='btn btn-primary' onClick={handlePrint}>Imprimir ticket</button>
    );


}


export default PrintButton
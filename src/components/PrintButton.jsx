import React from 'react';
import '../utils/plugin_impresora_termica.js'


function PrintButton({
    order, 
    orderDetails, 
    onClick 
}){
    const handlePrint = () =>{
//        const printData = { order, orderDetails};
//        const printWindow = window.open('','', 'height=500,width=500');
//        printWindow.document.write(`<html><head><title>Ticket de orden</title></head><body><pre>${JSON.stringify(printData, null, 2)}</pre></body></html>`)
//        printWindow.print();
//        printWindow.close();
        imprimir()
    }
    return(
        <button 
            className='btn btn-primary' 
            onClick={() => {
                onClick()
                if(order.length > 0){
                    if(orderDetails.printTicket){
                        handlePrint()
                    }
                }
            }}
        >
            Cobrar
        </button>
    )
}

async function imprimir(){
    
}


export default PrintButton
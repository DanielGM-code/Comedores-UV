import React from 'react';


function PrintButton({order, orderDetails}){
    const handlePrint = () =>{
//        const printData = { order, orderDetails};
//        const printWindow = window.open('','', 'height=500,width=500');
//        printWindow.document.write(`<html><head><title>Ticket de orden</title></head><body><pre>${JSON.stringify(printData, null, 2)}</pre></body></html>`)
//        printWindow.print();
//        printWindow.close();
        imprimir()
    };
    return(
        <button className='btn btn-primary' onClick={handlePrint}>Imprimir Ticket</button>
    );


}

async function imprimir(){
    let nombreImpresora = "SAM4S ELLIX20II";
    let api_key = "12345"
    
   
    const conector = new connetor_plugin()
                conector.fontsize("2")
                conector.textaling("center")
                conector.text("Ferreteria Angel")
                conector.fontsize("1")
                conector.text("Calle de las margaritas #45854")
                conector.text("PEC7855452SCC")
                conector.feed("3")
                conector.textaling("left")
                conector.text("Fecha: Miercoles 8 de ABRIL 2022 13:50")                        
                conector.text("Cant.       Descripcion      Importe")
                conector.text("------------------------------------------")
                conector.text("1- Barrote 2x4x8                    $110")
                conector.text("3- Esquinero Vinil                  $165")
                conector.feed("1")
                conector.fontsize("2")
                conector.textaling("center")
                conector.text("Total: $275")
                conector.qr("https://abrazasoft.com")
                conector.feed("5")
                conector.cut("0") 

            const resp = await conector.imprimir(nombreImpresora, api_key);
            if (resp === true) {              
            
            } else {
                 console.log("Problema al imprimir: "+resp)                    
            
            }
}


export default PrintButton
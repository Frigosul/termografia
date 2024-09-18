import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RefObject } from 'react';

// Define um hook que gera o PDF
export const useGeneratePDF = () => {
  const generatePDF = async (divRef: RefObject<HTMLDivElement>) => {
    if (!divRef.current) return; // Verifica se o ref é válido

    const divElement = divRef.current;

    // Captura a div como imagem 
    const canvas = await html2canvas(divElement);

    // Obtém a imagem do canvas em formato PNG
    const imgData = canvas.toDataURL('image/png');

    // Cria um novo PDF com jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Define a largura e altura do PDF
    const imgWidth = 210; // Largura do PDF em mm
    // const imgHeight = (canvas.height * imgWidth) / canvas.width;
    // ajusta altura para ocupar 100% da folha A4.
    const imgHeight = 297

    // Adiciona a imagem ao PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);



    // Abrir o PDF no navegador na mesma aba
    const blobURL = pdf.output('bloburl')
    window.open(blobURL)
  };

  return { generatePDF };
};

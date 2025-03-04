import { useState, useRef } from 'react';
import Table from '../components/table';
import Papa from 'papaparse';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faX } from '@fortawesome/free-solid-svg-icons';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import notoSansJP from "./NotoSansJP-VariableFont_wght-normal.js";
import itimFont from "./Itim-Regular-normal.js";
import notoSansJPBold from "./NotoSansJP-Medium-normal.js";

const App = () => {
  const [vocab_file, setVocabFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [row, setRow] = useState(1);
  const fileInputRef = useRef(null);
  const tableRef = useRef(null);

  const handleFileChagne = (e) => {
    const file = e.target.files[0];
    setVocabFile(file);

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setTableData(result.data);
        },
      });
    }
  };

  const handleRemoveFile = () => {
    setVocabFile(null);
    setTableData([]);
    setRow(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Register fonts
    doc.addFileToVFS('Itim-Regular-normal.ttf', itimFont);
    doc.addFont('Itim-Regular-normal.ttf', 'Itim', 'normal');
    doc.addFileToVFS('NotoSansJP-Regular.ttf', notoSansJP);
    doc.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
    doc.addFileToVFS('NotoSansJP-Medium-normal.ttf', notoSansJPBold);
    doc.addFont('NotoSansJP-Medium-normal.ttf', 'NotoSansJP-Medium', 'normal');

    doc.setFont('NotoSansJP')

    autoTable(doc, {
      html: tableRef.current,
      startY: 10,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      margin: { top: 10, left: 10, right: 10 },
      tableWidth: '100%',
      columnStyles: {
        0: { font: 'NotoSansJP', fontSize: 15, halign: 'center', valign: 'middle', cellWidth: 25 },
        1: { font: 'NotoSansJP-Medium', cellWidth: 'auto' }, 
      },
      columnWidth: 'auto',
      didParseCell: function (data) {
        const cell = data.cell;
        const text = data.cell.raw instanceof HTMLElement
          ? data.cell.raw.textContent || data.cell.raw.innerText || ''
          : String(data.cell.raw);

        if (cell.raw && cell.raw.classList && cell.raw.classList.contains('opacity-20')) {
          data.cell.styles.textColor = [200, 200, 200]; 
        }
        else if (cell.raw && cell.raw.classList && cell.raw.classList.contains('opacity-0')) {
          data.cell.styles.textColor = [255, 255, 255];
        }
        else if (cell.raw && cell.raw.classList && cell.raw.classList.contains('text-lg')) {
          data.cell.styles.fontSize = 20;
          data.cell.styles.font = 'NotoSansJP-Medium';
        }
    
        const strippedText = text.replace(/<\/?[^>]+(>|$)/g, "").trim();
      
        // const isJapanese = /[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/.test(strippedText); 
        const isThaiOrEnglish = /[a-zA-Z\u0E00-\u0E7F]/.test(strippedText) && !/[\u3040-\u30ff\u31f0-\u31ff\u4e00-\u9fff]/.test(strippedText);
      
        if (isThaiOrEnglish) {
          data.cell.styles.font = 'Itim';  
        }
      },
    });

    doc.save("vocab_worksheet.pdf");
  };
  

  return (
    <>
    <div className={`font-itim box-border flex w-screen h-screen item-center overflow-hidden 
                      ${vocab_file ? 'max-sm:block' : ''}`}>
      <div className={`w-1/2 bg-amber-100 flex flex-col justify-center items-center max-sm:w-full ${vocab_file ? 'max-sm:py-5 max-sm:h-2/5' : ''}`}>
        <div className='mb-5 w-full items-center flex flex-col'>
          <div className='w-lg text-center max-sm:w-96'>
            <p className='font-bold text-4xl mb-3 max-sm:text-2xl'>Let's create your own worksheet for vocabulary!</p>
            <p className='mb-5'>use the provided template and upload the file</p>
          </div>
          <div>
          <a href="/vocab_template.csv" download="vocab_template.csv">
            <button type="button" className="text-sm px-4 py-2 text-white bg-blue-400 rounded-md shadow-sm cursor-pointer hover:bg-blue-500 transition-colors">
                Download template <FontAwesomeIcon icon={faDownload} />
            </button>
          </a>
        </div>
        <hr className="w-96 h-0.5 mx-auto my-4 border-0 rounded-sm md:my-10 bg-gray-700 max-sm:w-80" />
        <div className="flex items-center gap-2">
          <label htmlFor="vocab_file" className="bg-white px-3 py-1 rounded-md border-1 border-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
            Choose File
          </label>
          <input 
            type="file"
            id="vocab_file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChagne}
          />
          <span>{vocab_file ? (
            <>
              {vocab_file.name}{" "}
              <button 
              type="button" 
              title="remove file"
              className='decoration-0 bg-none text-red-500 cursor-pointer ml-3'
              onClick={handleRemoveFile}>
                <FontAwesomeIcon icon={faX} />
              </button>
            </>
          ) : (
            "No file chosen"
          )}
          </span>
        </div>
        </div>
        <div className='mb-5'>
          <button 
            type="button" 
            className="text-sm px-4 py-2 bg-amber-400 rounded-md shadow-sm cursor-pointer hover:bg-amber-500 transition-colors"
            onClick={handleDownloadPDF}
          >
            Download Worksheet
          </button>
        </div>
      </div>
      <div className={`w-1/2 bg-amber-200 pt-12 items-center max-sm:w-auto 
                        ${vocab_file ? 'max-sm:py-5 max-sm:h-3/5 max-sm:' : ''} 
                        flex justify-center flex-col`}>
        {!vocab_file ?
          <label htmlFor="vocab_file"
            className='text-4xl font-bold text-white border-dashed border-4 rounded-3xl h-13/14 w-3/4 justify-center cursor-pointer justify-self-center flex items-center
                      max-sm:w-0 max-sm:hidden'
            onClick={handleFileChagne}>
              Upload file to begin!
          </label> 
          : 
          <>
            <div className="h-7/8 w-3/4 justify-self-center mb-5">
              <div className='w-full h-full max-h-"297mm" max-w-"210mm" bg-white p-5 overflow-y-scroll 
                              print:w-"210mm" print:h-"297mm" print:overflow-hidden print:break-after-page'>
                <Table data={tableData} rowCount={row} ref={tableRef} />
              </div>
            </div>
            <div className='justify-self-center flex items-center'>
              <p className='text-sm mr-3'>increase number of rows</p>
              <input 
                type="number"
                className='z-10 bg-white shadow-sm w-16 h-9 rounded-md px-3'
                min={1}
                value={row}
                onChange={(e) => setRow(e.target.value)}>
              </input>
            </div>
          </>
        }
      </div>
    </div>
    </>
  );
};

export default App;

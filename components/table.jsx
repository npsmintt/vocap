import React from 'react';
import './table.css';

const Table = React.forwardRef(({data, rowCount}, ref) => {
    const rows = Array.from({ length: rowCount }, (_, index) => index);

    if (!data || data.length === 0) 
        return <p>No data available</p>
    
    return (
        <table ref={ref} className='border-collapse'>
            <tbody>
                {data.map((row, index) => (
                <React.Fragment key={index}>
                    <tr>
                        <td rowSpan="2" className='text-lg text-center'>{row.Vocabulary}</td>
                        <td colSpan="10" className='text-xs h-1'>{row.Pronunciation}</td>
                    </tr>
                    <tr>
                        <td colSpan="10" className='text-xs h-1'>{row.Translation}</td>
                    </tr>
                    {rows.map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        <td className='opacity-20 text-center'>{row.Vocabulary}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td>
                        <td className='opacity-0 text-center'>{row.Vocabulary}</td> */}
                    </tr>
                    ))}
                </React.Fragment>
                ))}
            </tbody>
        </table>
    );
});

export default Table;
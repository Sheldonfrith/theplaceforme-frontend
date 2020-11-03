import React from 'react';
import styled from 'styled-components';
// import TableCore from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';


const TableContainer = styled.div`
    width: 100%;
    overflow-x:auto;
`;

const StyledTable = styled.table`
    width: 100%;
    text-align: left;
    font-weight: normal;
`;

interface TableProps {
    header: any[],
    columns?: any[],
    rows?: any[],
}

const Table: React.FunctionComponent<TableProps> = ({header,columns,rows}) => {
    if (columns && rows){
        throw new Error('cannot define BOTH columns and rows for this table component');
    }
    if (!columns && !rows){
        // console.log(header,columns, rows);
        throw new Error('No input list of rows or columns detected for this Table component');
    }
    if (!Array.isArray(columns?columns:rows)){
        // console.log(header,columns, rows);
        throw new Error('Cannot render table component because inputs are not valid arrays');
    }
//table can be either defined by columns or rows, not both
//the input props are simply a list of lists of of jsx elements, which will be inserted in order
//HEADER is always defined rows-based, left to right, always at the top

//remove null values from the active list
if (columns){
    columns = columns.filter(item=>item!==null);
}
if (rows){
    rows = rows.filter(item=>item!==null);
}


//rendering with row-based list is much easier, so convert columns based list to rows list here:
if (columns && !rows){
    //>> this short method taken from StackOverflow, im not sure how it would handle columns of different lengths
    if (!Array.isArray(columns[0])) throw new Error('error in Table component, columns[0] is not an array'+columns[0]);
    rows = columns[0].map((_, rowIndex) => columns!.map(col => col[rowIndex]));
}
// const numberOfColumns = columns?columns.length:rows![0].length;

    return (
        <TableContainer>
        {(rows)?
        <StyledTable>
                {header?(
                    <thead>
                        <tr className="d-flex">
                        {header.map((item,index)=><th key={`tableHeader${index}`} align="left">{item}</th>)}
                        </tr>
                    </thead>
                )
            :<thead></thead>}
            <tbody>
                {rows.map((rowItems,index1)=>{
                    return (
                        <tr key={`tablerow${index1}`} className="d-flex">
                            {rowItems.map((item: any,index: any)=>{
                                return <td key={`tablecell${index}`} align="left">{item}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
        :<></>}
        </TableContainer>
        );


}
export default Table;
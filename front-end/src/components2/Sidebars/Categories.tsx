import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {ListGroup}from 'react-bootstrap';
import {ViewObjectProps}from '../Layout';


export interface CategoriesSidebarProps{
    categories: ViewObjectProps[]
}
const CategoriesSidebar: React.FunctionComponent<CategoriesSidebarProps> =({categories})=> {

return (
<ListGroup>
    {categories.map(category=>{
    return <ListGroup.Item key={category.id} action onClick={category.onClick}>{category.text}</ListGroup.Item>
    })}
</ListGroup>
);
}
export default CategoriesSidebar;

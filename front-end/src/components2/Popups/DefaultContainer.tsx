import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {Modal} from 'react-bootstrap';

export interface DefaultPopupContainerProps{
    title: string,
    content: JSX.Element,
    footer: JSX.Element,
}
const DefaultPopupContainer: React.FunctionComponent<DefaultPopupContainerProps> =({content, title, footer})=> {

return (
<Modal
    size="lg"
    aria-labelledby="modal-title"
>
    <Modal.Header closeButton>
        <Modal.Title id="modal-title">
            {title}
        </Modal.Title>
        <Modal.Body>
            {content}
        </Modal.Body>
        <Modal.Footer>
            {footer}
        </Modal.Footer>
    </Modal.Header>
    {content}
</Modal>
);
}
export default DefaultPopupContainer;

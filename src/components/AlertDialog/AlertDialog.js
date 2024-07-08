import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

function AlertDialog({ open, setOpen, title, description, handleSubmit }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleBtnAgreeClick = () => {
        handleSubmit();
        setOpen(false);
    };

    return (
        <Modal show={open} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{description}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleBtnAgreeClick}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
};

export default AlertDialog;

import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const AreYouSureDeleteModal = props => {
    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.close}
                centered
                animation={false}
            >
                <Modal.Header>
                    <Modal.Title>
                        Jeste li sigurni da želite izbrisati stavku?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.izbrisi}>
                        Da
                    </Button>
                    <Button variant="primary" onClick={props.nemojIzbrisati}>
                        Ne
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AreYouSureDeleteModal;

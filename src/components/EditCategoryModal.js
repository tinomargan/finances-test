import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import NewCategoryModal from "./NewCategoryModal";
import AreYouSureModal from "./AreYouSureModal";

const EditCategoryModal = ({ show, close, reload, selectedCategory }) => {
    /* const [showAreYouSureModal, setShowAreYouSureModal] = React.useState(false); */
    const selectedCategoryRef = doc(db, "category", selectedCategory.id);

    /* ARE YOU SURE MODAL FUNCTIONS */

    /* const handleOdustani = () => {
        console.log("odustajem");
        close();
    }

    const handleNemojOdustati = () => {
        console.log("ne odustajem");
        setShowAreYouSureModal(false);
    } */

    /* INITIAL VALUES */

    const [editCategory, setEditCategory] = React.useState({
        ...selectedCategory
    });

    /* HANDLING CHANGES */

    const handleChange = e => {
        setEditCategory(prevEditCategory => {
            return {
                ...prevEditCategory,
                [e.target.name]: e.target.value
            };
        });
    };

    /* SAVING THE EDITED ITEM IN THE DATABASE */

    const handleSave = async () => {
        try {
            await updateDoc(selectedCategoryRef, {
                name: editCategory.name
            });
        } catch (error) {
            console.error(error);
        }
        close();
        reload();
    };

    return (
        <div>
            {/* <AreYouSureModal
                show={showAreYouSureModal}
                odustani={close}
                nemojOdustati={() => setShowAreYouSureModal(false)}
            /> */}
            <Modal
                show={show}
                onHide={close}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Uredi kategoriju</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Naziv kategorije</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editCategory.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <div>
                        <Button
                            variant="secondary"
                            onClick={close}
                            className="mx-2"
                        >
                            Odustani
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                        >
                            Spremi promjene
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditCategoryModal;

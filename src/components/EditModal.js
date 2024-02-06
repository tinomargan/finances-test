import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "../config/firebase";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import NewCategoryModal from "./NewCategoryModal";
import AreYouSureModal from "./AreYouSureModal";
import AreYouSureDeleteModal from "./AreYouSureDeleteModal";

const EditModal = ({ selectedItem, show, close, reload }) => {
    const [showAreYouSureModal, setShowAreYouSureModal] = React.useState(false);
    const [showAreYouSureDeleteModal, setShowAreYouSureDeleteModal] = React.useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = React.useState(false);
    const [categoriesList, setCategoriesList] = React.useState([]);
    const selectedItemRef = doc(db, "item", selectedItem.id);

    /* TODAY'S DATE INITIAL VALUES */

    const todayDate = new Date().toLocaleDateString("en-ca");
    const todayDateForDateCreatedAndDateModified = new Date().toUTCString();

    /* FETCHING CATEGORIES FROM THE DATABASE */

    React.useEffect(() => {
        const fetchCategoriesList = async () => {
            try {
                const firestoreInstance = getFirestore();
                const categoryCollectionReference = collection(firestoreInstance, "category");
                const sortedCategories = query(categoryCollectionReference, orderBy("name", "asc"))
                const data = await getDocs(sortedCategories);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setCategoriesList(filteredData);
                /* setLoading(false); */
            } catch (error) {
                console.error(error);
                /* setLoading(false); */
            }
        };

        fetchCategoriesList();
    }, []);

    /* ARE YOU SURE MODAL FUNCTIONS */

    const handleOdustani = () => {
        console.log("odustajem");
        close();
    }

    const handleNemojOdustati = () => {
        console.log("ne odustajem");
        setShowAreYouSureModal(false);
    }

    /* INITIAL VALUES */

    const [editItem, setEditItem] = React.useState({
        ...selectedItem,
        eventDate: selectedItem.eventDateForEditModal,
        paidDate: selectedItem.paidDateForEditModal
    });

    /* HANDLING CHANGES */

    const handleChange = e => {
        setEditItem(prevEditItem => {
            return {
                ...prevEditItem,
                [e.target.name]:
                    e.target.type === "radio" ? e.target.id : e.target.value
            };
        });
    };

    /* CHECK IF A USER STARTED EDITING THE ITEM */



    /* "TODAY" BUTTON */

    const handleTodayButton = e => {
        if (e.target.id === "danas-event-date") {
            document.getElementById("eventDate").value = todayDate;
            e.target.value = todayDate;
            console.log("Today date: ", todayDate);
            e.target.name = "eventDate";
            handleChange(e);
        } else if (e.target.id === "danas-paid-date") {
            document.getElementById("paidDate").value = todayDate;
            e.target.value = todayDate;
            e.target.name = "paidDate";
            handleChange(e);
        }
    };

    /* SAVING THE EDITED ITEM IN THE DATABASE */

    const handleSave = async () => {
        try {
            if (editItem.eventDate !== null) {
                const firebaseEventDate = new Timestamp();
                firebaseEventDate.seconds =
                    Date.parse(editItem.eventDate) / 1000;
                firebaseEventDate.nanoseconds = 0;
                editItem.eventDate = firebaseEventDate;
            }

            if (editItem.paidDate !== null) {
                const firebasePaidDate = new Timestamp();
                firebasePaidDate.seconds = Date.parse(editItem.paidDate) / 1000;
                firebasePaidDate.nanoseconds = 0;
                editItem.paidDate = firebasePaidDate;
            }

            editItem.dateUpdated = todayDateForDateCreatedAndDateModified;
            let firebaseDateUpdated = null;
            firebaseDateUpdated = new Timestamp();
            firebaseDateUpdated.seconds =
                Date.parse(editItem.dateUpdated) / 1000;
            firebaseDateUpdated.nanoseconds = 0;
            editItem.dateUpdated = firebaseDateUpdated;

            await updateDoc(selectedItemRef, {
                ...editItem,
                amount: parseFloat(editItem.amount)
            });
        } catch (error) {
            console.error(error);
        }
        close();
        reload();
    };

    /* DELETING THE ITEM FROM THE DATABASE */

    const handleIzbrisi = async () => {
        try {
            await deleteDoc(selectedItemRef);
        } catch (error) {
            console.error(error);
        }
        close();
        reload();
    };

    const handleNemojIzbrisati = () => {
        setShowAreYouSureDeleteModal(false);
    }

    return (
        <div>
            <AreYouSureModal
                show={showAreYouSureModal}
                odustani={() => handleOdustani()}
                nemojOdustati={() => handleNemojOdustati()}
            />
            <AreYouSureDeleteModal
                show={showAreYouSureDeleteModal}
                izbrisi={() => handleIzbrisi()}
                nemojIzbrisati={() => handleNemojIzbrisati()}
            />
            <NewCategoryModal
                show={showNewCategoryModal}
                close={() => setShowNewCategoryModal(false)}
                reload={reload}
            />
            {/* {show && ( */}
            <Modal show={show} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>Uredi stavku</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="desc">
                            <Form.Label>Opis stavke</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="desc"
                                value={editItem.desc}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Check
                            type="radio"
                            inline
                            label="Prihod"
                            name="incomeExpense"
                            id="prihod"
                            checked={editItem.incomeExpense === "prihod"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            className="mb-3"
                            type="radio"
                            inline
                            label="Trošak"
                            name="incomeExpense"
                            id="trosak"
                            checked={editItem.incomeExpense === "trosak"}
                            onChange={handleChange}
                        />
                        <br></br>
                        <Form.Label>Iznos</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="amount"
                                aria-label="Iznos"
                                onChange={handleChange}
                                value={editItem.amount}
                            />
                            <InputGroup.Text>€</InputGroup.Text>
                        </InputGroup>
                        <Form.Check
                            type="radio"
                            inline
                            label="Gotovina"
                            name="paymentType"
                            id="gotovina"
                            checked={editItem.paymentType === "gotovina"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            className="mb-3"
                            type="radio"
                            inline
                            label="Kartica"
                            name="paymentType"
                            id="kartica"
                            checked={editItem.paymentType === "kartica"}
                            onChange={handleChange}
                        />
                        <br></br>
                        <Form.Label>Datum događaja</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end"
                            controlId="eventDate"
                        >
                            <Form.Control
                                name="eventDate"
                                type="date"
                                value={editItem.eventDate}
                                onChange={handleChange}
                            />
                            <Button
                                variant="primary"
                                id="danas-event-date"
                                onClick={handleTodayButton}
                            >
                                Danas
                            </Button>
                        </Form.Group>
                        <Form.Label>Datum plaćanja</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end"
                            controlId="paidDate"
                        >
                            <Form.Control
                                name="paidDate"
                                type="date"
                                value={editItem.paidDate}
                                onChange={handleChange}
                            />
                            <Button
                                variant="primary"
                                id="danas-paid-date"
                                onClick={handleTodayButton}
                            >
                                Danas
                            </Button>
                        </Form.Group>
                        <Form.Group
                            className="mb-3 d-flex align-items-end"
                            controlId="category"
                        >
                            <Form.Select
                                name="category"
                                type="select"
                                defaultValue={"Razno"}
                                onChange={handleChange}
                            >
                                {categoriesList.map(category => (
                                    <option
                                        value={category.name}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                                <option>+ Dodaj novu kategoriju</option>
                            </Form.Select>
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
                        <Button variant="danger" onClick={() => setShowAreYouSureDeleteModal(true)}>
                            Izbriši stavku
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => setShowAreYouSureModal(true)}
                            className="mx-2"
                        >
                            Odustani
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Spremi promjene
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            {/* )} */}
        </div>
    );
};

export default EditModal;

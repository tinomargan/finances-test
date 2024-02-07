import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "../config/firebase";
import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
    Timestamp
} from "firebase/firestore";
import NewCategoryModal from "./NewCategoryModal";
import AreYouSureModal from "./AreYouSureModal";

const NewItemModal = ({ show, close, selectedItem, reload }) => {
    /* INITIAL VALUES */

    const [newItem, setNewItem] = React.useState(
        selectedItem || {
            desc: "",
            incomeExpense: null,
            amount: 0,
            paymentType: null,
            eventDate: null,
            paidDate: null,
            dateCreated: todayDateForDateCreatedAndDateModified,
            category: "Razno"
        }
    );
    console.log(newItem);

    const isInEditMode = !!selectedItem;
    console.log(isInEditMode);

    const [showAreYouSureModal, setShowAreYouSureModal] = React.useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = React.useState(
        false
    );
    const [categoriesList, setCategoriesList] = React.useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(true);
    const itemCollectionReference = collection(db, "item");
    const categoryCollectionReference = collection(db, "category");

    /* TODAY'S DATE INITIAL VALUES */

    const todayDate = new Date().toLocaleDateString("en-ca");
    const todayDateForDateCreatedAndDateModified = new Date().toUTCString();

    /* FETCHING CATEGORIES FROM THE DATABASE */

    const fetchCategoriesList = async () => {
        try {
            const firestoreInstance = getFirestore();
            const categoryCollectionReference = collection(
                firestoreInstance,
                "category"
            );
            const sortedCategories = query(
                categoryCollectionReference,
                orderBy("name", "asc")
            );
            const data = await getDocs(sortedCategories);
            const filteredData = data.docs.map(doc => ({
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

    React.useEffect(() => {
        fetchCategoriesList();
    }, []);

    React.useEffect(() => {
        setNewItem(selectedItem);
    }, [selectedItem]);

    /* DODAVANJE NOVE KATEGORIJE */

    const handleDodaj = async newCategory => {
        try {
            await addDoc(categoryCollectionReference, {
                ...newCategory,
                name: newCategory.name
            });
            console.log(newCategory.name);
            fetchCategoriesList();
            setNewItem(newItem => ({
                ...newItem,
                category: newCategory.name
            }));
        } catch (error) {
            console.error(error);
        }
        setShowNewCategoryModal(false);
    };

    /* ARE YOU SURE MODAL FUNCTIONS */

    const handleOdustani = () => {
        console.log("odustajem");
        setNewItem({
            desc: "",
            incomeExpense: null,
            amount: 0,
            paymentType: null,
            eventDate: null,
            paidDate: null,
            category: "Razno"
        });
        setShowAreYouSureModal(false);
        close();
    };

    const handleNemojOdustati = () => {
        console.log("ne odustajem");
        setShowAreYouSureModal(false);
    };

    /* HANDLING CHANGES */

    const handleChange = e => {
        if (e.target.value === "+ Nova kategorija") {
            console.log(e.target.value);
            setShowNewCategoryModal(true);
        }
        setNewItem(newItem => ({
            ...newItem,
            [e.target.name]:
                e.target.type === "radio" ? e.target.id : e.target.value
        }));
    };

    /* const handleClick = e => {
        setIsDropdownOpen(true)
    }; */

    /* CHECK IF A USER STARTED TO INPUT THE VALUES */

    function startedToInputValues() {
        if (newItem.desc !== "") {
            setShowAreYouSureModal(true);
        } else if (newItem.amount !== 0) {
            setShowAreYouSureModal(true);
        } else if (newItem.incomeExpense != null) {
            setShowAreYouSureModal(true);
        } else if (newItem.paymentType != null) {
            setShowAreYouSureModal(true);
        } else if (newItem.eventDate != null) {
            setShowAreYouSureModal(true);
        } else if (newItem.paidDate != null) {
            setShowAreYouSureModal(true);
        } else if (newItem.category !== "Razno") {
            setShowAreYouSureModal(true);
        } else {
            close();
        }
    }

    /* "TODAY" BUTTON */

    const handleTodayButton = e => {
        if (e.target.id === "danas-event-date") {
            document.getElementById("eventDate").value = todayDate;
            e.target.value = todayDate;
            e.target.name = "eventDate";
            handleChange(e);
        } else if (e.target.id === "danas-paid-date") {
            document.getElementById("paidDate").value = todayDate;
            e.target.value = todayDate;
            e.target.name = "paidDate";
            handleChange(e);
        }
    };

    /* SAVING THE NEW ITEM IN THE DATABASE */

    const handleSave = async () => {
        try {
            if (newItem.eventDate !== null) {
                const firebaseEventDate = new Timestamp();
                firebaseEventDate.seconds =
                    Date.parse(newItem.eventDate) / 1000;
                firebaseEventDate.nanoseconds = 0;
                newItem.eventDate = firebaseEventDate;
            }

            if (newItem.paidDate !== null) {
                const firebasePaidDate = new Timestamp();
                firebasePaidDate.seconds = Date.parse(newItem.paidDate) / 1000;
                firebasePaidDate.nanoseconds = 0;
                newItem.paidDate = firebasePaidDate;
            }

            newItem.dateCreated = todayDateForDateCreatedAndDateModified;
            let firebaseDateCreated = null;
            firebaseDateCreated = new Timestamp();
            firebaseDateCreated.seconds =
                Date.parse(newItem.dateCreated) / 1000;
            firebaseDateCreated.nanoseconds = 0;
            newItem.dateCreated = firebaseDateCreated;

            await addDoc(itemCollectionReference, {
                ...newItem,
                amount: parseFloat(newItem.amount)
            });
            console.log();
        } catch (error) {
            console.error(error);
        }
        close();
        reload();
    };

    return (
        <div>
            <AreYouSureModal
                show={showAreYouSureModal}
                odustani={() => handleOdustani()}
                nemojOdustati={() => handleNemojOdustati()}
            />
            <NewCategoryModal
                show={showNewCategoryModal}
                close={() => setShowNewCategoryModal(false)}
                reload={reload}
                handleDodaj={handleDodaj}
            />
            <Modal show={show} onHide={close} fullscreen animation={false}>
                <Modal.Header>
                    <Modal.Title>Nova stavka</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="desc">
                            <Form.Label>Opis stavke</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                autoFocus
                                name="desc"
                                value={newItem && newItem.desc}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group
                            controlId="incomeExpense"
                            onChange={handleChange}
                        >
                            <Form.Check
                                type="radio"
                                inline
                                label="Prihod"
                                name="incomeExpense"
                                id="prihod"
                            />
                            <Form.Check
                                className="mb-3"
                                type="radio"
                                inline
                                label="Trošak"
                                name="incomeExpense"
                                id="trosak"
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Label>Iznos</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="amount"
                                aria-label="Iznos"
                                onChange={handleChange}
                            />
                            <InputGroup.Text>€</InputGroup.Text>
                        </InputGroup>
                        <Form.Group
                            controlId="paymentType"
                            onChange={handleChange}
                        >
                            <Form.Check
                                type="radio"
                                inline
                                label="Gotovina"
                                name="paymentType"
                                id="gotovina"
                            />
                            <Form.Check
                                className="mb-3"
                                type="radio"
                                inline
                                label="Kartica"
                                name="paymentType"
                                id="kartica"
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Label>Datum događaja</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end"
                            controlId="eventDate"
                        >
                            <Form.Control
                                name="eventDate"
                                type="date"
                                onChange={handleChange}
                            />
                            <Button
                                variant="primary"
                                id="danas-event-date"
                                onClick={handleTodayButton}
                                className="ms-3"
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
                                onChange={handleChange}
                            />
                            <Button
                                variant="primary"
                                id="danas-paid-date"
                                onClick={handleTodayButton}
                                className="ms-3"
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
                                onChange={handleChange}
                                value={newItem && newItem.category}
                                /* onClick={handleClick} */
                            >
                                {categoriesList.map(category => (
                                    <option
                                        value={category.name}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                                <option>+ Nova kategorija</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={startedToInputValues}>
                        Odustani
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Unesi novu stavku
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NewItemModal;

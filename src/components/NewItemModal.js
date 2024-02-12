import React from "react";
import trash_icon from "../images/trash-solid.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { db } from "../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import NewCategoryModal from "./NewCategoryModal";
import AreYouSureModal from "./AreYouSureModal";
import AreYouSureDeleteModal from "./AreYouSureDeleteModal";

const NewItemModal = ({ show, close, selectedItem, reload }) => {
    /* TODAY'S DATE INITIAL VALUES */

    const todayDate = new Date().toLocaleDateString("en-ca");
    const todayDateForDateCreatedAndDateModified = new Date().toUTCString();

    /* INITIAL VALUES */

    const [newItem, setNewItem] = React.useState({
        ...selectedItem
    } || {
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

    const [showAreYouSureModal, setShowAreYouSureModal] = React.useState(false);
    const [showAreYouSureDeleteModal, setShowAreYouSureDeleteModal] = React.useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = React.useState(false);
    const [categoriesList, setCategoriesList] = React.useState([]);

    React.useEffect(() => {
        fetchCategoriesList();
    }, []);

    React.useEffect(() => {
        setNewItem(selectedItem);
    }, [selectedItem]);

    const isInEditMode = !!selectedItem;

    /* CONVERTING DATES FROM THE SELECTED ITEM TO BE DISPLAYED IN UI */

    const itemCollectionReference = collection(db, "item");
    const categoryCollectionReference = collection(db, "category");

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
        setNewItem(newItem => ({
            ...newItem,
            [e.target.name]:
                e.target.type === "radio" ? e.target.id : e.target.value
        }));
    };

    /* ADD A NEW CATEGORY */

    const handleNewCategory = () => {
        console.log("nova kategorija");
        setShowNewCategoryModal(true);
    }

    /* CHECK IF A USER STARTED TO INPUT THE VALUES */

    /* function startedToInputValues() {
        if (newItem.desc !== "" || newItem.desc !== selectedItem.desc) {
            setShowAreYouSureModal(true);
        } else if (newItem.amount !== 0 || newItem.amount !== selectedItem.amount) {
            setShowAreYouSureModal(true);
        } else if (newItem.incomeExpense != null || newItem.incomeExpense !== selectedItem.incomeExpense) {
            setShowAreYouSureModal(true);
        } else if (newItem.paymentType != null || newItem.paymentType !== selectedItem.paymentType) {
            setShowAreYouSureModal(true);
        } else if (newItem.eventDate != null || newItem.eventDate !== selectedItem.eventDate) {
            setShowAreYouSureModal(true);
        } else if (newItem.paidDate != null || newItem.paidDate !== selectedItem.paidDate) {
            setShowAreYouSureModal(true);
        } else if (newItem.category !== "Razno" || newItem.category !== selectedItem.category) {
            setShowAreYouSureModal(true);
        } else {
            close();
        }
    } */

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
    };

    /* DELETING THE ITEM FROM THE DATABASE */

    const handleIzbrisi = async () => {
        const selectedItemRef = doc(db, "item", selectedItem.id);
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

    console.log(selectedItem);

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
                handleDodaj={handleDodaj}
            />
            <Modal show={show} onHide={close} fullscreen animation={false}>
                <Modal.Header>
                    {isInEditMode
                        ? <Modal.Title>Uredi stavku</Modal.Title>
                        : <Modal.Title>Nova stavka</Modal.Title>
                    }
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
                                checked={newItem && newItem.incomeExpense === "prihod"}
                                onChange={handleChange}
                            />
                            <Form.Check
                                className="mb-3"
                                type="radio"
                                inline
                                label="Trošak"
                                name="incomeExpense"
                                id="trosak"
                                checked={newItem && newItem.incomeExpense === "trosak"}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Label>Iznos</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="amount"
                                aria-label="Iznos"
                                value={newItem && newItem.amount}
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
                                checked={newItem && newItem.paymentType === "gotovina"}
                                onChange={handleChange}
                            />
                            <Form.Check
                                className="mb-3"
                                type="radio"
                                inline
                                label="Kartica"
                                name="paymentType"
                                id="kartica"
                                checked={newItem && newItem.paymentType === "kartica"}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Label>Datum događaja</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end date-and-category-wrapper"
                            controlId="eventDate"
                        >
                            <Form.Control
                                className="me-4 date-and-category-item"
                                name="eventDate"
                                type="date"
                                value={newItem && newItem.eventDate}
                                onChange={handleChange}
                            />
                            <Button
                                className="date-and-category-button"
                                variant="primary"
                                id="danas-event-date"
                                onClick={handleTodayButton}
                            >
                                Danas
                            </Button>
                        </Form.Group>
                        <Form.Label>Datum plaćanja</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end date-and-category-wrapper"
                            controlId="paidDate"
                        >
                            <Form.Control
                                className="me-4 date-and-category-item"
                                name="paidDate"
                                type="date"
                                value={newItem && newItem.paidDate}
                                onChange={handleChange}
                            />
                            <Button
                                className="date-and-category-button"
                                variant="primary"
                                id="danas-paid-date"
                                onClick={handleTodayButton}
                            >
                                Danas
                            </Button>
                        </Form.Group>
                        <Form.Label>Kategorija</Form.Label>
                        <Form.Group
                            className="mb-3 d-flex align-items-end date-and-category-wrapper"
                            controlId="category"
                        >
                            <Form.Select
                                className="me-4 date-and-category-item"
                                name="category"
                                type="select"
                                onChange={handleChange}
                                value={newItem && newItem.category}
                            >
                                {categoriesList.map(category => (
                                    <option
                                        value={category.name}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button
                                variant="outline-primary"
                                className="date-and-category-button"
                                id="new-category-button"
                                onClick={handleNewCategory}
                            >
                                +
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                {isInEditMode
                    ?
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            className="me-auto"
                            onClick={() => setShowAreYouSureDeleteModal(true)}
                        >
                            <img src={trash_icon} alt="Izbriši stavku" className="form-delete-icon" />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={close}
                        >
                            Odustani
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                        >
                            Spremi promjene
                        </Button>
                    </Modal.Footer>
                    :
                    <Modal.Footer>
                        <Button variant="secondary" onClick={close}>
                            Odustani
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Unesi novu stavku
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </div>
    );
};

export default NewItemModal;

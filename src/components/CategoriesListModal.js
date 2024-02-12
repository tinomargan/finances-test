import React from "react";
import trash_icon from "../images/trash-solid.svg";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { db } from "../config/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import EditCategoryModal from "./EditCategoryModal";
import AreYouSureDeleteModal from "./AreYouSureDeleteModal";

const CategoriesListModal = ({ show, close }) => {
    const [categoryList, setCategoryList] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [showEditCategoryModal, setShowEditCategoryModal] = React.useState(false);
    const [showAreYouSureDeleteModal, setShowAreYouSureDeleteModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    /* RELOAD CONTENT */

    const reload = () => window.location.reload();

    /* DOHVAĆANJE KATEGORIJA IZ BAZE */

    React.useEffect(() => {
        const fetchCategoryList = async () => {
            try {
                const firestoreInstance = getFirestore();
                const categoryCollectionReference = collection(firestoreInstance, "category");
                const sortedCategories = query(categoryCollectionReference, orderBy("name", "asc"))
                const data = await getDocs(sortedCategories);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setCategoryList(filteredData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchCategoryList();
    }, [show, showEditCategoryModal, showAreYouSureDeleteModal]);

    const handleEdit = () => {
        console.log("editko ");
        setShowEditCategoryModal(true);
    }

    /* DELETING THE ITEM FROM THE DATABASE */

    const handleIzbrisi = async () => {
        try {
            const selectedCategoryRef = doc(db, "category", selectedCategory.id);
            console.log("deleteko ");
            await deleteDoc(selectedCategoryRef);
        } catch (error) {
            console.error(error);
        }
        setShowAreYouSureDeleteModal(false);
    };

    const handleNemojIzbrisati = () => {
        setShowAreYouSureDeleteModal(false);
    }

    /* LOADING SPINNER */

    if (loading) {
        return (
            <div className="loading-indicator">
                <Spinner animation="border" role="status" variant="secondary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    console.log(categoryList);

    return (
        <div>
            {showEditCategoryModal && (
                <EditCategoryModal
                    show={showEditCategoryModal}
                    close={() => setShowEditCategoryModal(false)}
                    selectedCategory={selectedCategory}
                    reload={reload}
                />
            )}
            <AreYouSureDeleteModal
                show={showAreYouSureDeleteModal}
                izbrisi={() => handleIzbrisi()}
                nemojIzbrisati={() => handleNemojIzbrisati()}
            />
            <Modal show={show} onHide={close} fullscreen animation={false}>
                <Modal.Header>
                    <Modal.Title>Popis kategorija</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {categoryList.map(category => (
                        <div className="categories-wrapper" key={category.id}>
                            <div className="category-name">{category.name}</div>
                            <div className="category-delete">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setShowAreYouSureDeleteModal(true);
                                        setSelectedCategory(category);
                                    }
                                    }
                                >
                                    <img src={trash_icon} alt="Izbriši stavku" className="form-delete-icon" />
                                </Button>
                            </div>
                            <div className="category-edit">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        handleEdit();
                                        setSelectedCategory(category);
                                    }
                                    }
                                >
                                    Uredi
                                </Button>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={close}
                    >
                        Zatvori
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CategoriesListModal;
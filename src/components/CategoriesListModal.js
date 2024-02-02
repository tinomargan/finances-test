import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addDoc, collection, getDocs, getFirestore, orderBy, query, Timestamp } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import EditCategoryModal from "./EditCategoryModal";

const CategoriesListModal = ({ show, close }) => {
    const [categoryList, setCategoryList] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState([]);
    const [showEditCategoryModal, setShowEditCategoryModal] = React.useState(false);
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
    }, []);

    const handleEdit = () => {
        console.log("editko ");
        setShowEditCategoryModal(true);
    }

    const handleDelete = () => {
        console.log("deleteko ");
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
            <Modal show={show} onHide={close} fullscreen animation={false}>
                <Modal.Header>
                    <Modal.Title>Popis kategorija</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {categoryList.map(category => (
                        <div className="categories-wrapper" key={category.id}>
                            <div className="category-name">{category.name}</div>
                            <div className="category-edit">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        handleEdit();
                                    }
                                    }
                                >
                                    Uredi
                                </Button>
                            </div>
                            <div className="category-delete">
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                >
                                    Izbriši
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
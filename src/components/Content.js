import React from "react";
import edit_icon from "../images/edit-icon.png";
import EditModal from "./EditModal";
import { getDocs, collection, getFirestore, query, orderBy } from "firebase/firestore";
import { Spinner } from "react-bootstrap";

export default function Content() {
    const [itemList, setItemList] = React.useState([]);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    /* RELOAD CONTENT */

    const reload = () => window.location.reload();

    /* DOHVAĆANJE STAVKI IZ BAZE */

    React.useEffect(() => {
        const fetchItemList = async () => {
            try {
                const firestoreInstance = getFirestore();
                const itemCollectionReference = collection(firestoreInstance, "item");
                const sortedItems = query(itemCollectionReference, orderBy("dateCreated", "desc"))
                const data = await getDocs(sortedItems);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setItemList(filteredData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchItemList();
    }, []);

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

    const handleShowEditModal = () => {
        setShowEditModal(true);
    }

    /* SHOWING THE FETCHED DATA FROM THE DATABASE */

    console.log(itemList);

    return (
        <div className="content--wrapper">
            {showEditModal && (
                <EditModal
                    show={showEditModal}
                    close={() => setShowEditModal(false)}
                    selectedItem={selectedItem}
                    reload={reload}
                />
            )}
            {itemList.map(item => (
                <div className="content--item" key={item.id}>
                    <div className="content--item-desc">{item.desc}</div>
                    <div className="content--item-eventDate-text">
                        {item.eventDate !== null ? "Datum događaja" : null}
                    </div>
                    <div className="content--item-eventDate">
                        {item.eventDate !== null
                            ? (item.eventDateForEditModal = new Date(
                                item.eventDate.seconds * 1000
                            ).toLocaleDateString("en-ca"))
                            : null}
                    </div>
                    <div className="content--item-paidDate-text">
                        {item.paidDate !== null ? "Plaćeno" : null}
                    </div>
                    <div className="content--item-paidDate">
                        {item.paidDate !== null
                            ? (item.paidDateForEditModal = new Date(
                                item.paidDate.seconds * 1000
                            ).toLocaleDateString("en-ca"))
                            : null}
                    </div>
                    <div
                        className="content--item-amount-eur"
                        style={
                            item.incomeExpense === "prihod"
                                ? { color: "green" }
                                : { color: "darkred" }
                        }
                    >
                        {item.amount.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}{" "}
                        €
                    </div>
                    <div className="content--item-amount-hrk">
                        {(item.amount * 7.5345).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })}{" "}
                        HRK
                    </div>
                    <div className="content--item-cash-card">
                        {item.paymentType !== null
                            ? item.paymentType.charAt(0).toUpperCase() +
                            item.paymentType.slice(1)
                            : "/"}
                    </div>
                    <div className="content--item-edit">
                        <img
                            src={edit_icon}
                            alt="edit"
                            className="content--item-edit-img"
                            onClick={() => {
                                handleShowEditModal();
                                setSelectedItem(item);
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
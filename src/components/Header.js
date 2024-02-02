import React from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export default function Header() {
    const [itemList, setItemList] = React.useState([]);

    const itemCollectionReference = collection(db, "item");

    React.useEffect(() => {
        const getItemList = async () => {
            try {
                const data = await getDocs(itemCollectionReference);
                const filteredData = data.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setItemList(filteredData);
            } catch (error) {
                console.error(error);
            }
        };
        getItemList();
    }, []);

    var totalCurrent = 0;
    var totalCurrentPlus = 0;
    var totalCurrentMinus = 0;
    var totalGotovina = 0;
    var totalGotovinaPlus = 0;
    var totalGotovinaMinus = 0;
    var totalKartica = 0;
    var totalKarticaPlus = 0;
    var totalKarticaMinus = 0;
    var totalUkupno = 0;
    var totalUkupnoPlus = 0;
    var totalUkupnoMinus = 0;

    /* IZRAČUN - UKUPNO */

    function getCurrentSum() {
        itemList.map(item => {
            if (item.incomeExpense === "prihod" && item.paidDate !== null) {
                totalCurrentPlus =
                    parseFloat(totalCurrentPlus) + parseFloat(item.amount);
            } else if (
                item.incomeExpense === "trosak" &&
                item.paidDate !== null
            ) {
                totalCurrentMinus =
                    parseFloat(totalCurrentMinus) + parseFloat(item.amount);
            }
            totalCurrent = (
                parseFloat(totalCurrentPlus) - parseFloat(totalCurrentMinus)
            ).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        });
        return totalCurrent;
    }

    /* IZRAČUN - GOTOVINA */

    function getCashSum() {
        itemList.map(item => {
            if (
                item.incomeExpense === "prihod" &&
                item.paymentType === "gotovina" &&
                item.paidDate !== null
            ) {
                totalGotovinaPlus =
                    parseFloat(totalGotovinaPlus) + parseFloat(item.amount);
            } else if (
                item.incomeExpense === "trosak" &&
                item.paymentType === "gotovina" &&
                item.paidDate !== null
            ) {
                totalGotovinaMinus =
                    parseFloat(totalGotovinaMinus) + parseFloat(item.amount);
            }
            totalGotovina = (
                parseFloat(totalGotovinaPlus) - parseFloat(totalGotovinaMinus)
            ).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        });
        return totalGotovina;
    }

    /* IZRAČUN - KARTICA */

    function getCardSum() {
        itemList.map(item => {
            if (
                item.incomeExpense === "prihod" &&
                item.paymentType === "kartica" &&
                item.paidDate !== null
            ) {
                totalKarticaPlus =
                    parseFloat(totalKarticaPlus) + parseFloat(item.amount);
            } else if (
                item.incomeExpense === "trosak" &&
                item.paymentType === "kartica" &&
                item.paidDate !== null
            ) {
                totalKarticaMinus =
                    parseFloat(totalKarticaMinus) + parseFloat(item.amount);
            }
            totalKartica = (
                parseFloat(totalKarticaPlus) - parseFloat(totalKarticaMinus)
            ).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        });
        return totalKartica;
    }

    /* IZRAČUN - BUDUĆE STANJE */

    function getTotalSum() {
        itemList.map(item => {
            if (item.incomeExpense === "prihod") {
                totalUkupnoPlus =
                    parseFloat(totalUkupnoPlus) + parseFloat(item.amount);
            } else {
                totalUkupnoMinus =
                    parseFloat(totalUkupnoMinus) + parseFloat(item.amount);
            }
            totalUkupno = (
                parseFloat(totalUkupnoPlus) - parseFloat(totalUkupnoMinus)
            ).toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
        });
        return totalUkupno;
    }

    return (
        <div className="header--wrapper">
            <div className="header--item-1-text">Trenutno stanje</div>
            <div className="header--item-1-content">{getCurrentSum()} €</div>
            <div className="header--item-2-text">Gotovina</div>
            <div className="header--item-2-content">{getCashSum()} €</div>
            <div className="header--item-3-text">Kartica</div>
            <div className="header--item-3-content">{getCardSum()} €</div>
            <div className="header--item-4-text">Buduće stanje</div>
            <div className="header--item-4-content">{getTotalSum()} €</div>
        </div>
    );
}

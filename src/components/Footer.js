import React from "react";
import dots_icon from "../images/dots-icon.png";
import NewItemModal from "./NewItemModal";
import CategoriesListModal from "./CategoriesListModal";

export default function Footer() {
    const [showNewItemModal, setShowNewItemModal] = React.useState(false);
    const [showCategoriesListModal, setShowCategoriesListModal] = React.useState(false);

    const handleNewItemModalClose = () => {
        setShowNewItemModal(false);
    };

    /* RELOAD CONTENT */

    const reload = () => window.location.reload();

    /* DROPDOWN MENU */

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleToggleOpen = () => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        } else {
            setIsDropdownOpen(true);
        }
    };

    const handleNovaStavka = () => {
        console.log("Nova stavka");
        setIsDropdownOpen(false);
        setShowNewItemModal(true);
    };

    const handleKategorije = () => {
        console.log("Kategorije");
        setIsDropdownOpen(false);
        setShowCategoriesListModal(true);
    };

    const handlePretraga = () => {
        console.log("Pretraga");
        setIsDropdownOpen(false);
    };

    const handleSortiraj = () => {
        console.log("Sortiraj");
        setIsDropdownOpen(false);
    };

    /* CLOSE THE DROPDOWN MENU ON OUTSIDE CLICK */

    const useOutsideClick = callback => {
        const dropdownRef = React.useRef();

        React.useEffect(() => {
            const handleClick = event => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target)
                ) {
                    callback();
                }
            };

            document.addEventListener("click", handleClick);

            return () => {
                document.removeEventListener("click", handleClick);
            };
        }, [dropdownRef]);

        return dropdownRef;
    };

    const handleClickOutside = () => {
        setIsDropdownOpen(false);
    };

    const dropdownRef = useOutsideClick(handleClickOutside);

    return (
        <div className={"footer--wrapper"}>
            <NewItemModal
                show={showNewItemModal}
                close={() => handleNewItemModalClose()}
                reload={reload}
            />
            <CategoriesListModal
                show={showCategoriesListModal}
                close={() => setShowCategoriesListModal(false)}
            />

            <div className="footer--item-1">SVE</div>
            <div className="footer--item-2">PRIHODI</div>
            <div className="footer--item-3">TROŠKOVI</div>
            <div
                className="footer--item-4"
                onClick={handleToggleOpen}
                ref={dropdownRef}
            >
                <img src={dots_icon} className="footer--item-4-img" />
            </div>
            <div className="footer--dropdown">
                {isDropdownOpen ? (
                    <ul className="footer--dropdown-list">
                        <li
                            className="footer--dropdown-list-item"
                            onClick={handleNovaStavka}
                        >
                            Nova stavka
                        </li>
                        <li
                            className="footer--dropdown-list-item"
                            onClick={handleKategorije}
                        >
                            Kategorije
                        </li>
                        <li
                            className="footer--dropdown-list-item"
                            onClick={handlePretraga}
                        >
                            Pretraga
                        </li>
                        <li
                            className="footer--dropdown-list-item"
                            onClick={handleSortiraj}
                        >
                            Sortiraj
                        </li>
                    </ul>
                ) : null}
            </div>
        </div>
    );
}
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Content from "./components/Content";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
    return (
        <div className="app--wrapper">
            <Header />
            <Content />
            <Footer />
        </div>
    );
}

export default App;
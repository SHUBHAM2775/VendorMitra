import React, { useState } from "react";
import Home from "./components/Home.jsx";
import Header from "./components/Header.jsx";
import Supplier from "./components/Supplier";

function App() {
  const [showSupplier, setShowSupplier] = useState(false);

  if (showSupplier) {
    return <Supplier />;
  }

  return (
    <>
      <Header onSupplierView={() => setShowSupplier(true)} />
      <Home />
    </>
  );
}

export default App;
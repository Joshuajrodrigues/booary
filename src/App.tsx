import "./App.css";
import { LibraryCard } from "./lib/LibraryCard";
const myLibrary = "/library/card.json";
function App() {
  const friendsList = ["http://localhost:4321/library/card.json"];
  return (
    <>
      <LibraryCard cardUrl={myLibrary} friends={friendsList} />
    </>
  );
}

export default App;

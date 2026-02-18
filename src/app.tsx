import "./app.css";
import { LibraryCard } from "./lib/libraryCard";
const myLibrary = "/library/card.json";
const friendsList = ["http://localhost:4321/library/card.json"];
export function App() {
  return (
    <>
      <LibraryCard cardlink={myLibrary} friends={friendsList} />
    </>
  );
}

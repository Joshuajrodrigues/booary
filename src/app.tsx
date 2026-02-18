import "./app.css";
import { LibraryCard } from "./lib/libraryCard";
const myLibrary = "/library/card.json";
const friendsList = ["http://localhost:5173/library/card.json"];
export function App() {
  return (
    <>
      <LibraryCard friends={friendsList} cardlink={myLibrary} />
    </>
  );
}

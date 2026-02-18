import { useState, useEffect } from "react";
import "./LibraryCard.css";

interface Book {
  key: string;
  name: string;
  finishedDate: string;
  author: string;
}

interface CardData {
  borrower: string;
  library: { name: string; signature: string };
  books: Book[];
  url?: string; // Optional URL for the card
}

interface Props {
  cardUrl: string;
  friends?: string[]; // Array of URLs
}

export const LibraryCard = ({ cardUrl, friends = [] }: Props) => {
  const [data, setData] = useState<CardData | null>(null);
  const [friendsData, setFriendsData] = useState<CardData[]>([]);

  useEffect(() => {
    fetch(cardUrl)
      .then((res) => res.json())
      .then(setData);
    if (friends.length > 0) {
      Promise.all(
        friends.map((url) =>
          fetch(url)
            .then((res) => res.json())
            .then((json) => ({ ...json, url })),
        ),
      ).then(setFriendsData);
    }
  }, [cardUrl, friends]);

  if (!data) return <div className={"loading"}>Loading library card...</div>;

  return (
    <div className={"card"}>
      <div className={"inner"}>
        <div className={"header"}>
          <span className={"year"}>20</span>
          <span className={"year"}>26</span>
        </div>

        <div className={"header"}>
          <h2 className={"libraryTitle"}>{data.library.name}</h2>
        </div>

        <div className={"fieldGroup"}>
          <p className={`${"fieldValue"} ${"nameValue"}`}>{data.borrower}</p>
          <label className={"label"}>Borrower's Name</label>
        </div>

        <div className={"fieldGroup"}>
          <p className={`${"fieldValue"} ${"signatureValue"}`}>
            {data.library.signature}
          </p>
          <label className={"label"}>Librarian's Signature</label>
        </div>

        <div className={"bookSection"}>
          <ul className={"bookList"}>
            {data.books.map((book, idx) => {
              console.log("friendsData", friendsData, data);
              const readersOfThisBook = friendsData.filter((friend) =>
                friend.books.some((friendBook) => friendBook.key === book.key),
              );
              console.log("readersOfThisBook", readersOfThisBook);
              return (
                <li key={idx} className={"bookRow"}>
                  <span className={"bookName"}>
                    {book.name} by {book.author}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <span className={"bookDate"}>{book.finishedDate}</span>
                    <div className={"friendSignatures"}>
                      {readersOfThisBook.length > 0 && (
                        <div className="friendSignatures">
                          {readersOfThisBook.map((friend, fIdx) => (
                            <a
                              key={fIdx}
                              href={
                                friend.url ? new URL(friend.url).origin : "#"
                              }
                              className="signatureLink"
                              title={`${friend.borrower} also read this`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {friend.library.signature}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

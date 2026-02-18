import { useState, useEffect } from "preact/hooks";
import "./libraryCard.css";
import register from "preact-custom-element";

export const LibraryCard = ({
  cardlink,
  friends = [],
  hidenav = false,
}: any) => {
  const [data, setData] = useState<any>(null);
  const [friendsData, setFriendsData] = useState<any[]>([]);
  const [viewYear, setViewYear] = useState<string>(
    new Date().getFullYear().toString(),
  );

  useEffect(() => {
    const friendsArray =
      typeof friends === "string" ? JSON.parse(friends) : friends;

    fetch(cardlink)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const availableYears = Object.keys(json.years).sort();
        const latestYear = availableYears[availableYears.length - 1];
        setViewYear((current) => {
          // If we already have a valid year selected, keep it.
          // Otherwise, use the latest from the file.
          return current && json.years[current] ? current : latestYear;
        });
      });

    if (Array.isArray(friendsArray) && friendsArray.length > 0) {
      Promise.all(
        friendsArray.map((url: string) =>
          fetch(url)
            .then((res) => res.json())
            .then((json) => ({ ...json, url })),
        ),
      ).then(setFriendsData);
    }
  }, [cardlink, friends]);

  if (!data) return <div className="loading">Loading...</div>;

  const availableYears = Object.keys(data.years).sort(
    (a, b) => Number(a) - Number(b),
  );
  const currentIndex = availableYears.indexOf(viewYear);
  const currentBooks = data.years[viewYear] || [];

  const changeYear = (dir: number) => {
    const newIndex = currentIndex + dir;
    if (newIndex >= 0 && newIndex < availableYears.length) {
      setViewYear(availableYears[newIndex]);
    }
  };

  return (
    <div className="card-container">
      {!hidenav && (
        <>
          <div className="nav-controls">
            <button
              class={"btn-left"}
              onClick={() => changeYear(-1)}
              disabled={currentIndex === 0}
            >
              ←
            </button>

            <button
              class={"btn-right"}
              onClick={() => changeYear(1)}
              disabled={currentIndex === availableYears.length - 1}
            >
              →
            </button>
          </div>
        </>
      )}

      <div className="card">
        <div className="inner">
          <div className="header">
            <span className="year">{viewYear.slice(0, 2)}</span>
            <span className="year">{viewYear.slice(2, 4)}</span>
          </div>

          <div className="header">
            <h2 className="libraryTitle">{data.library.name}</h2>
          </div>

          <div className="fieldGroup">
            <p className="fieldValue nameValue">{data.borrower}</p>
            <label className="label">Borrower's Name</label>
          </div>

          <div className="fieldGroup">
            <p className="fieldValue signatureValue">
              {data.library.signature}
            </p>
            <label className="label">Librarian's Signature</label>
          </div>

          <div className="bookSection">
            <ul className="bookList">
              {currentBooks.map((book: any, idx: number) => {
                // Find friends who read this book IN THE SAME YEAR
                const readersOfThisBook = friendsData.filter((friend) =>
                  friend.years[viewYear]?.some(
                    (fBook: any) => fBook.key === book.key,
                  ),
                );

                return (
                  <li key={idx} className="bookRow">
                    <span className="bookName">
                      {book.name} <small>by {book.author}</small>
                    </span>
                    <div className="bookMeta">
                      <span className="bookDate">{book.finishedDate}</span>
                      <div className="friendSignatures">
                        {readersOfThisBook.map((f, i) => (
                          <span key={i} title={f.borrower} className="sig">
                            {f.library.signature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

register(LibraryCard, "x-library-card", ["cardlink", "friends", "hidenav"]);

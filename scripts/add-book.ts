import inquirer from "inquirer";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

const DIR_PATH = path.join(process.cwd(), "public/library");
const FILE_PATH = path.join(process.cwd(), "public/library/card.json");
async function runCli() {
  await fs.ensureDir(DIR_PATH);

  if (!fs.existsSync(FILE_PATH)) {
    const profile = await inquirer.prompt([
      {
        type: "input",
        name: "borrower",
        message: "Enter borrower name",
      },
      {
        type: "input",
        name: "libName",
        message: "Enter library name",
        default: "Boo Library",
      },
    ]);
    const initialData = {
      borrower: profile.borrower,
      library: { name: profile.libName, signature: "🐾" },
      books: [],
    };
    await fs.writeJson(FILE_PATH, initialData, { spaces: 2 });
    console.log("✨ Library card created!");
  }
  const { query } = await inquirer.prompt([
    { type: "input", name: "query", message: "Search for a book:" },
  ]);
  const { data } = await axios.get(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`,
  );
  if (!data.docs?.length) {
    console.log("No books found.");
    return;
  }

  interface IBook {
    key: string;
    title: string;
    author_name: string[];
    finishedDate: string;
  }

  const { selectedBook } = await inquirer.prompt([
    {
      type: "select",
      name: "selectedBook",
      message: "Select a book:",
      choices: data.docs.map((book: IBook) => ({
        name: `${book.title} (${book.author_name?.[0] || "Unknown"})`,
        value: {
          key: book.key,
          name: book.title,
          author: book.author_name?.[0] || "Unknown",
          finishedDate: new Date().toLocaleDateString("en-IN"),
        },
      })),
    },
  ]);
  const cardData = await fs.readJson(FILE_PATH);
  cardData.books.push(selectedBook);
  await fs.writeJson(FILE_PATH, cardData, { spaces: 2 });

  console.log(`Added ${selectedBook.name}`);
}
runCli();

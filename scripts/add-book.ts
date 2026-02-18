import inquirer from "inquirer";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

const DIR_PATH = path.join(process.cwd(), "public/library");
const FILE_PATH = path.join(process.cwd(), "public/library/card.json");

const EMOJI_OPTIONS = [
  "🐾",
  "🐈",
  "🐕",
  "🦉",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐸",
  "🐢",
  "🐝",
  "🦋",
  "🐙",
  "🦖",
  "🦕",
  "🐉",
  "🦄",
  "🐧",
  "🦦",
  "🦥",
  "📚",
  "🖋️",
  "✨",
  "📜",
  "🕯️",
  "Custom...",
];
interface IBook {
  key: string;
  title: string;
  author_name: string[];
  finishedDate: string;
}

async function runCli() {
  const currentYear = new Date().getFullYear().toString();
  await fs.ensureDir(DIR_PATH);
  let cardData: any = {
    borrower: "",
    library: { name: "", signature: "" },
    years: {},
  };

  if (fs.existsSync(FILE_PATH)) {
    cardData = await fs.readJson(FILE_PATH);
  } else {
    const profile = await inquirer.prompt([
      { type: "input", name: "borrower", message: "Enter borrower name:" },
      {
        type: "input",
        name: "libName",
        message: "Enter library name:",
        default: "Boo Library",
      },
    ]);
    const { emojiChoice } = await inquirer.prompt([
      {
        type: "select",
        name: "emojiChoice",
        message: "Select your librarian signature:",
        choices: EMOJI_OPTIONS,
      },
    ]);
    let signature = emojiChoice;
    if (emojiChoice === "Custom...") {
      const { custom } = await inquirer.prompt([
        { type: "input", name: "custom", message: "Paste your custom emoji:" },
      ]);
      signature = custom;
    }
    cardData.borrower = profile.borrower;
    cardData.library = { name: profile.libName, signature };
  }
  if (!cardData.years[currentYear]) {
    cardData.years[currentYear] = [];
    console.log(`\n🎊 Happy New Year! Created archive for ${currentYear}.`);
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
  cardData.years[currentYear].push(selectedBook);

  await fs.writeJson(FILE_PATH, cardData, { spaces: 2 });

  console.log(`Added ${selectedBook.name} to ${currentYear} card!`);
}
runCli();

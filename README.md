# Anki Clone

This is a simple flashcard application built with SvelteKit, Svelte 5, `shadcn-svelte`, and Tailwind CSS.

## Features

- Create and delete decks of flashcards.
- View flashcards with front, back, and notes.
- Import flashcards from a CSV file.
- All data is saved in your browser's local storage.

## Development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Usage

### Creating a Deck

1. Click on the "Create Deck" button.
2. Enter a name for your deck in the dialog and click "Create".

### Deleting a Deck

Click the "X" button on a deck card to delete it.

### Studying Flashcards

1. Click on a deck to select it.
2. The first card's front will be displayed.
3. Click "Show Answer" to reveal the back and any notes.
4. Use the "Previous" and "Next" buttons to navigate through the cards.

### Importing Cards from CSV

1. Select the deck you want to import cards into.
2. Click the "Import CSV" button.
3. Choose a CSV file from your computer. The CSV file should have the following columns in order: `front`, `back`, `notes`. The file should not have a header row.
4. The cards will be automatically added to the selected deck.

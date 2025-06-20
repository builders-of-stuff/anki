import { browser } from '$app/environment';
import type { Deck } from '$lib/types';

function getDecksFromLocalStorage(): Deck[] {
	if (!browser) {
		return [];
	}
	const decks = localStorage.getItem('decks');
	return decks ? JSON.parse(decks) : [];
}

let decks = $state<Deck[]>(getDecksFromLocalStorage());

$effect.root(() => {
	$effect(() => {
		if (browser) {
			localStorage.setItem('decks', JSON.stringify(decks));
		}
	});
});

export const store = {
	get decks() {
		return decks;
	},
	set decks(newDecks: Deck[]) {
		decks = newDecks;
	}
};

export type Card = {
	id: string;
	front: string;
	back: string;
	notes?: string;
};

export type Deck = {
	id: string;
	name: string;
	cards: Card[];
};

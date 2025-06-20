<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { store } from '$lib/store.svelte';
	import type { Deck, Card as CardType } from '$lib/types';
	import { X } from 'lucide-svelte';

	let open = $state(false);
	let deckName = $state('');
	let selectedDeckId = $state<string | null>(null);
	let currentCardIndex = $state(0);
	let showBack = $state(false);
	let importOpen = $state(false);
	let addCardOpen = $state(false);
	let newCardFront = $state('');
	let newCardBack = $state('');
	let newCardNotes = $state('');

	const createDeck = () => {
		if (deckName.trim()) {
			const newDeck: Deck = {
				id: crypto.randomUUID(),
				name: deckName,
				cards: []
			};
			store.decks = [...store.decks, newDeck];
			deckName = '';
			open = false;
		}
	};

	const addCard = () => {
		if (newCardFront.trim() && newCardBack.trim() && selectedDeckId) {
			const newCard: CardType = {
				id: crypto.randomUUID(),
				front: newCardFront,
				back: newCardBack,
				notes: newCardNotes
			};

			const deckIndex = store.decks.findIndex((d) => d.id === selectedDeckId);
			if (deckIndex !== -1) {
				const newDecks = [...store.decks];
				const updatedDeck = { ...newDecks[deckIndex] };
				updatedDeck.cards = [...updatedDeck.cards, newCard];
				newDecks[deckIndex] = updatedDeck;
				store.decks = newDecks;
			}

			newCardFront = '';
			newCardBack = '';
			newCardNotes = '';
			addCardOpen = false;
		}
	};

	const deleteDeck = (e: MouseEvent, deckId: string) => {
		e.stopPropagation();
		store.decks = store.decks.filter((d) => d.id !== deckId);
		if (selectedDeckId === deckId) {
			selectedDeckId = null;
		}
	};

	const selectDeck = (deckId: string) => {
		selectedDeckId = deckId;
		currentCardIndex = 0;
		showBack = false;
	};

	const selectedDeck = $derived(store.decks.find((d) => d.id === selectedDeckId));
	const currentCard = $derived(selectedDeck?.cards[currentCardIndex]);

	const nextCard = () => {
		if (selectedDeck && currentCardIndex < selectedDeck.cards.length - 1) {
			currentCardIndex++;
			showBack = false;
		}
	};

	const prevCard = () => {
		if (currentCardIndex > 0) {
			currentCardIndex--;
			showBack = false;
		}
	};

	const handleFileUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file && selectedDeckId) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				const lines = text.split('\n');
				const newCards = lines.reduce((acc, line) => {
					const [front, back, notes] = line.split(',');
					if (front && back) {
						acc.push({ id: crypto.randomUUID(), front, back, notes: notes || '' });
					}
					return acc;
				}, [] as CardType[]);

				const deckIndex = store.decks.findIndex((d) => d.id === selectedDeckId);
				if (deckIndex !== -1) {
					const newDecks = [...store.decks];
					const updatedDeck = { ...newDecks[deckIndex] };
					updatedDeck.cards = [...updatedDeck.cards, ...newCards];
					newDecks[deckIndex] = updatedDeck;
					store.decks = newDecks;
				}
				importOpen = false;
			};
			reader.readAsText(file);
		}
	};
</script>

<div class="container mx-auto p-4">
	<header class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Anki Clone</h1>
		<Dialog.Root bind:open>
			<Dialog.Trigger>Create Deck</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Create New Deck</Dialog.Title>
					<Dialog.Description>Give your new deck a name.</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-4 py-4">
					<Input placeholder="Deck Name" bind:value={deckName} />
				</div>
				<Dialog.Footer>
					<Button type="submit" onclick={createDeck}>Create</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</header>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
		<aside class="md:col-span-1">
			<h2 class="mb-2 text-xl font-semibold">Decks</h2>
			<div class="flex flex-col gap-2">
				{#each store.decks as deck (deck.id)}
					<div class="cursor-pointer" onclick={() => selectDeck(deck.id)}>
						<Card.Root>
							<Card.Header class="flex items-center justify-between">
								<Card.Title>{deck.name}</Card.Title>
								<Button variant="ghost" size="icon" onclick={(e) => deleteDeck(e, deck.id)}>
									<X class="h-4 w-4" />
								</Button>
							</Card.Header>
						</Card.Root>
					</div>
				{/each}
			</div>
		</aside>

		<main class="md:col-span-3">
			{#if selectedDeck}
				<div>
					<h2 class="mb-2 text-xl font-semibold">{selectedDeck.name}</h2>
					<div class="mb-4 flex gap-2">
						<Dialog.Root bind:open={addCardOpen}>
							<Dialog.Trigger>Add Card</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Add New Card</Dialog.Title>
									<Dialog.Description>Fill in the details for the new card.</Dialog.Description>
								</Dialog.Header>
								<div class="grid gap-4 py-4">
									<Input placeholder="Front" bind:value={newCardFront} />
									<Input placeholder="Back" bind:value={newCardBack} />
									<Input placeholder="Notes (optional)" bind:value={newCardNotes} />
								</div>
								<Dialog.Footer>
									<Button type="submit" onclick={addCard}>Add</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog.Root>
						<Dialog.Root bind:open={importOpen}>
							<Dialog.Trigger>Import CSV</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Import from CSV</Dialog.Title>
									<Dialog.Description>
										Select a CSV file with columns: front, back, notes.
									</Dialog.Description>
								</Dialog.Header>
								<Input type="file" accept=".csv" onchange={handleFileUpload} />
							</Dialog.Content>
						</Dialog.Root>
					</div>
					{#if currentCard}
						<div class="rounded-lg border p-4">
							<div class="mb-2 text-lg font-medium">
								{currentCard.front}
							</div>
							<hr class="my-2" />
							{#if showBack}
								<div class="text-lg">{currentCard.back}</div>
								{#if currentCard.notes}
									<div class="mt-2 text-sm text-gray-500">{currentCard.notes}</div>
								{/if}
							{:else}
								<Button onclick={() => (showBack = true)}>Show Answer</Button>
							{/if}
						</div>
						<div class="mt-4 flex justify-center gap-4">
							<Button onclick={prevCard} disabled={currentCardIndex === 0}>Previous</Button>
							<Button
								onclick={nextCard}
								disabled={currentCardIndex === selectedDeck.cards.length - 1}>Next</Button
							>
						</div>
					{:else}
						<p>This deck is empty.</p>
					{/if}
				</div>
			{:else}
				<p>Select a deck to start studying.</p>
			{/if}
		</main>
	</div>
</div>

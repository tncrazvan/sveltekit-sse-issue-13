// src/routes/events/+server.js

import { delay } from '$lib/delay';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { events } from 'sveltekit-sse';
import { store_message_next } from '../../lib/stores/store_message_next';
import { store_messages } from '../../lib/stores/store_messages';

/**
 * @type {Map<string, import('sveltekit-sse/dist/events').EmitterOfManyEvents>}
 */
const emitters = new Map();

// whenever there's a new message, execute the emitters
// to notify clients
store_message_next.subscribe(function run(message) {
  console.log(`new message: ${message}`);
  console.log({ emitters });
  emitters.forEach(function run(emit) {
    emit('broadcast', message);
  });
});

export function GET({ url }) {
  // The id is a safe guard to avoid duplicated clients.
  // If you're going to use this in production,
  // I suggest you validate this id somehow and
  // possibly avoid adding duplicate items in your `emitters` map.
  const id = url.searchParams.get('id');

  if (!id) {
    throw error(400, 'Please specify an id as a query string `?id=...`.');
  }

  const e = events(async function start(emit) {
    // recover previous messages and emit them, though
    // you could comment this part out if you don't
    // care about the history of the chat.
    const messages = get(store_messages);
    for (const message of messages) {
      emit('broadcast', message);
    }

    // save the emitter, so that the above message subscriber
    // can trigger it to broadcast messages
    emitters.set(id, emit);

    console.log(emitters);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      await delay({ milliseconds: 1000 });
    }
  }).onCancel(function stop() {
    emitters.delete(id);
    console.log('cancel');
    console.log(emitters);
  });

  return e.toResponse();
}

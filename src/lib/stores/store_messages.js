import { writable } from 'svelte/store';
import { store_message_next } from './store_message_next';

/**
 * @type {Array<string>}
 */
let $store_messages = [];

export const store_messages = writable($store_messages);

store_messages.subscribe(function run(value) {
  $store_messages = value;
});

store_message_next.subscribe(function run(message) {
  $store_messages.push(message);
  store_messages.set($store_messages);
});

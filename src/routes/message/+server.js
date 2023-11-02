import { store_message_next } from '$lib/stores/store_message_next.js';

export async function POST({ request }) {
  const text = await request.text();
  // this will trigger all emitters to
  // notify the clients that there's a new message
  store_message_next.set(text);

  // return an indicative message... even though status is 200
  return new Response('ok');
}

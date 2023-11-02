<script>
  import { error } from '$lib/error';
  import { ok } from '$lib/ok';
  import { uuid } from '$lib/uuid';
  import { source } from 'sveltekit-sse';

  // This id should probably be validated somehow or
  // received straight from a server session instead of
  // using a random local uuid.
  const id = uuid();
  const broadcast = source(`/events?id=${id}`).select('broadcast');

  let content = '';

  // append new messages and add a new line at the end.
  $: content = `${content}${$broadcast}\n`;

  let value = '';

  /**
   * @returns {Promise<Unsafe<string>>}
   */
  async function send() {
    const response = await fetch('/message', {
      method: 'POST',
      body: value
    });

    value = '';

    if (response.status >= 300) {
      return error(`Request failed with status ${response.status}`);
    }

    const text = await response.text();

    return ok(text);
  }
</script>

<input type="text" bind:value />
<button on:mouseup={send}>
  <span>send</span>
</button>

<hr />

<span>Messages:</span>

<pre>{content}</pre>

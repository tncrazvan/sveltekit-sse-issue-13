/**
 *
 * @param {{milliseconds:number}} payload
 */
export function delay({ milliseconds }) {
  return new Promise(function run(resolve) {
    setTimeout(resolve, milliseconds);
  });
}

// A field no person sees. Bots that fill every input fill this one, and the server quietly drops the submission.
export default function Honeypot() {
  return <input data-hp type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />;
}
// Value of any honeypot on the page; send it as `website` with the form body.
export const hp = () => ({ website: Array.from(document.querySelectorAll<HTMLInputElement>('[data-hp]')).map((i) => i.value).find(Boolean) ?? '' });

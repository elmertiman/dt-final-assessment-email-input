export async function retrieveEmails() {
  const oResp = await fetch("/emails.js");
  const sText = await oResp.text();
  const hasMatch = sText.match(/export const emails = (\[.*\]);/s);
  if (hasMatch) {
    return eval(hasMatch[1]);
  }
  return [];
}

export async function retrieveEmails() {
  const oResponse = await fetch("/emails.js");
  const sResponseText = await oResponse.text();
  const hasEmailMatch = sResponseText.match(/export const emails = (\[.*\]);/s);
  if (hasEmailMatch) {
    return eval(hasEmailMatch[1]);
  }
  return [];
}

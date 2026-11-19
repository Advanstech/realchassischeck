/**
 * Masks a phone contact for greeting surfaces: "024 ••• 4567".
 * Emails and anything that is not a clean phone number stay readable.
 */
export function maskContact(contact: string): string {
  const digits = contact.replace(/[\s-]/g, '');
  if (!/^\+?\d{7,15}$/.test(digits)) return contact;

  let local = digits.replace(/^\+/, '');
  if (local.startsWith('233') && local.length === 12) local = `0${local.slice(3)}`;
  if (local.length < 7) return contact;

  return `${local.slice(0, 3)} ••• ${local.slice(-4)}`;
}

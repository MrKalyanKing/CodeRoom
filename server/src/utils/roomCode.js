import Room from '../modules/Room/models/Room.js';

function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function uniqueCode() {
  let code;
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 20) throw new Error('Could not generate unique room code');
  } while (await Room.exists({ code }));
  return code;
}

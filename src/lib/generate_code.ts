export const generateCode = (length = 6) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Все большие буквы
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    code += letters[randomIndex];
  }

  return code;
};

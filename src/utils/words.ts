// O'zbekcha mashhur va qulay so'zlar ro'yxati
export const UZBEK_WORDS = [
  "kitob", "bilim", "inson", "maktab", "dastur", "harakat", "natija", "yutuq",
  "kelajak", "vaqt", "hayot", "fikr", "qobiliyat", "mashq", "tezlik", "aniqlik",
  "maqsad", "dunyo", "ishonch", "mehnat", "shijoat", "yurak", "quyosh", "shahar",
  "yaxshi", "kuchli", "katta", "yangi", "toza", "tez", "ilm", "hunar", "baxt",
  "orzu", "umid", "sabab", "sayr", "yozish", "fikrlash", "yaratish", "muvaffaqiyat",
  "rivojlanish", "tarix", "madaniyat", "texnologiya", "tizim", "kod", "loyixa",
  "g'alaba", "jasorat", "mehr", "oqibat", "odam", "suv", "havo", "yer", "osmon",
  "yulduz", "nur", "sabot", "quvonch", "tabassum", "so'z", "til", "adabiyot",
  "tabiat", "yoz", "bahor", "kuz", "qish", "tong", "oqshom", "kun", "kecha",
  "qalam", "daftar", "sinf", "ustoz", "shogird", "oila", "vatan", "el", "yurt",
  "sharaf", "g'oya", "reja", "qoida", "amaliyot", "tajriba", "xotira", "ziyo"
];

export const UZBEK_SENTENCES = [
  "Bilim va aql insonning eng katta boyligidir.",
  "Mehnat qilgan rohat ko'rar, dangasa esa armonda qolar.",
  "Klaviaturada tez va aniq yozish vaqtingizni sezilarli tejaydi.",
  "Har bir yangi kun yangi imkoniyatlar va bilimlarni olib keladi.",
  "Dasturlash va zamonaviy texnologiyalar kelajak poydevoridir.",
  "O'z ustida muntazam ishlagan inson har doim muvaffaqiyatga erishadi.",
  "Sabr va matonat bilan har qanday qiyinchilikni yengish mumkin.",
  "Kitob o'qish inson tafakkurini kengaytiradi va nutqini boyitadi."
];

// Generate randomized words string with count
export function getRandomWords(count: number = 25): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * UZBEK_WORDS.length);
    words.push(UZBEK_WORDS[randomIndex]);
  }
  return words.join(' ');
}

// Generate random sentence
export function getRandomSentence(): string {
  const idx = Math.floor(Math.random() * UZBEK_SENTENCES.length);
  return UZBEK_SENTENCES[idx];
}

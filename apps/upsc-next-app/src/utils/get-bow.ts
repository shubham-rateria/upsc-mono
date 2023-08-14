const stopWords = new Set([
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "you're",
  "you've",
  "you'll",
  "you'd",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "she's",
  "her",
  "hers",
  "herself",
  "it",
  "it's",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "that'll",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "don't",
  "should",
  "should've",
  "now",
  "d",
  "ll",
  "m",
  "o",
  "re",
  "ve",
  "y",
  "ain",
  "aren",
  "aren't",
  "couldn",
  "couldn't",
  "didn",
  "didn't",
  "doesn",
  "doesn't",
  "hadn",
  "hadn't",
  "hasn",
  "hasn't",
  "haven",
  "haven't",
  "isn",
  "isn't",
  "ma",
  "mightn",
  "mightn't",
  "mustn",
  "mustn't",
  "needn",
  "needn't",
  "shan",
  "shan't",
  "shouldn",
  "shouldn't",
  "wasn",
  "wasn't",
  "weren",
  "weren't",
  "won",
  "won't",
  "wouldn",
  "wouldn't",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
]);

export function getBOWFromString(keyword: string) {
  const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
  const apostropheRegex = /'/g;

  const numberRegex = /^\d{4}$/;
  const uniqueWords = new Set();

  // Split keyword into words
  const words = keyword
    .replace(/[()]/g, " ")
    .replace(punctuationRegex, " ")
    .replace(apostropheRegex, " ")
    .toLowerCase()
    .split(/\s+/);

  words.forEach((word) => {
    // Remove brackets, punctuation, and apostrophes, and convert to lowercase
    const cleanedWord = word;

    // Add the word to uniqueWords set if it's not a stop word, pronoun, and a non-4-digit number
    if (
      cleanedWord &&
      !stopWords.has(cleanedWord) &&
      !cleanedWord.match(numberRegex)
    ) {
      uniqueWords.add(cleanedWord);
    } else if (cleanedWord.match(numberRegex)) {
      uniqueWords.add(cleanedWord);
    }
  });

  // Convert the set back to an array
  const finalList = Array.from(uniqueWords);

  return finalList;
}

export function getBOW(keywords: string[]): string[] {
  const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
  const apostropheRegex = /'/g;

  const uniqueWords = new Set<string>();

  keywords.forEach((keyword) => {
    // Split keyword into words
    const words = keyword.split(/\s+/);

    words.forEach((word) => {
      // Remove brackets, punctuation, and apostrophes, and convert to lowercase
      const cleanedWord = word
        .replace(/[()]/g, "")
        .replace(punctuationRegex, "")
        .replace(apostropheRegex, "")
        .toLowerCase();

      // Add the word to uniqueWords set if it's not a stop word or pronoun
      if (cleanedWord && !stopWords.has(cleanedWord)) {
        uniqueWords.add(cleanedWord);
      }
    });
  });

  // Convert the set back to an array
  const finalList: string[] = Array.from(uniqueWords);

  return finalList;
}


export const getRandomWord = (): { word: string; clue: string } => {
  const wordsWithClues = [
    { word: 'thirdweb', clue: 'A platform for web3 development' },
    { word: 'ethereum', clue: 'A leading blockchain for smart contracts' },
    { word: 'polygon', clue: 'A scalable blockchain network' },
    { word: 'optimism', clue: 'Layer 2 scaling solution for Ethereum' },
    { word: 'base', clue: 'The foundational layer or main point' },
    { word: 'avalanche', clue: 'A blockchain platform known for high throughput' },
    { word: 'cookies', clue: 'Small pieces of data stored while browsing' },
    { word: 'blockchain', clue: 'A chain of blocks containing information' },
    { word: 'wallet', clue: 'A digital means to store cryptocurrency' },
    { word: 'smartcontract', clue: 'A self-executing contract with the terms written into code' },
    { word: 'ledger', clue: 'A record-keeping book or system' },
    { word: 'decentralize', clue: 'Reducing the centralization of a system' },
    { word: 'consensus', clue: 'General agreement or decision-making process in blockchain' },
    { word: 'tokenize', clue: 'To convert an asset into a digital token' },
    { word: 'cryptography', clue: 'Art of writing or solving codes in security' },
    { word: 'architecture', clue: 'The design and structure of a system' },
    { word: 'scalability', clue: 'Ability to handle growing amounts of work or transactions' },
    { word: 'framework', clue: 'A basic structure underlying a system or concept' },
    { word: 'algorithm', clue: 'A process or set of rules to be followed in calculations' },
    { word: 'integration', clue: 'The act of combining or adding parts to make a unified whole' },
    { word: 'development', clue: 'The process of developing or being developed' },
    { word: 'innovation', clue: 'Introducing something new or different' },
    { word: 'security', clue: 'Measures taken to guard against crime or attack' },
    { word: 'network', clue: 'A group or system of interconnected people or things' },
    { word: 'protocol', clue: 'A set of rules governing the format of data in a network' }
  ];
  
  const randomIndex = Math.floor(Math.random() * wordsWithClues.length);
  return wordsWithClues[randomIndex];
};


export const checkGuess = (word: string, guess: string): boolean => {
  return word.includes(guess);
};

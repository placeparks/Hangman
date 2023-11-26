'use client';

import { ThirdwebProvider, useAddress, Web3Button, useContract, smartWallet,   metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,} from '@thirdweb-dev/react';
import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import { getRandomWord } from './lib/gameLogic';
import { TOKEN_CONTRACT_ADDRESS } from './constants/constants';

export default function Home() {

  return (
    
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        smartWallet(embeddedWallet({
          auth: {
            options: [
              "email",
              "google",
              "apple",
              "facebook",
            ],
          }, 
        }),
        {
          factoryAddress: "0x44106B672501fEfE2151288F3e0be9Fbc08126B3",
          gasless: true,
        }),
      ]} 
    >
      <Navbar/>
      <HangmanGame/>
    </ThirdwebProvider>
  )
}

const HangmanGame = () => {
  const address = useAddress();
  const [word, setWord] = useState<string>('');
  const [clue, setClue] = useState<string>(''); // New state for the clue
  const [guesses, setGuesses] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number>(6);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [claimingPrize, setClaimingPrize] = useState<boolean>(false);
  const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);
  const { contract } = useContract( TOKEN_CONTRACT_ADDRESS, "token-drop")
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newWordWithClue = getRandomWord(); // Get new word and clue
    setWord(newWordWithClue.word);
    setClue(newWordWithClue.clue); // Set the clue
    setGuesses([]);
    setRemaining(6);
    setGameOver(false);
    setWin(false);
    setClaimingPrize(false);
    setPrizeClaimed(false);
  };

  useEffect(() => {
    // Check for win or lose only if the word is not empty
    if (word) {
      // Check for win
      const wordSet = new Set(word.split(''));
      const guessedSet = new Set(guesses);
      if (Array.from(wordSet).every(letter => guessedSet.has(letter))) {
        setWin(true);
        setGameOver(true);
      }
      // Check for lose
      if (remaining <= 0) {
        setWin(false);
        setGameOver(true);
      }
    }
  }, [guesses, remaining, word]);

  const handleGuess = (letter: string) => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
      if (!word.includes(letter)) {
        setRemaining(remaining - 1);
      }
    }
  };

  const claimAmount = 10

  return (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        marginTop: '2rem',
    }}>
      {!address ? (
        <h3>Sign in to start playing.</h3>
      ) : (
        <>
          <div style={{
              marginBottom: '2rem',
          }}>
            <p style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                letterSpacing: '0.5rem',
                padding: '1rem',
                backgroundColor: '#222',
                borderRadius: '10px',
            }}>{word.split('').map((letter) => (guesses.includes(letter) ? letter : '_')).join(' ')}</p>
          </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginBottom: '2rem',
            }}>
               <h3>Clue: {clue}</h3>
               <br/>
                <h3>Guesses:</h3>
                <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                }}>{guesses.join(', ')}</p>
            </div>
          
          <p style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
          }}>Remaining Guesses: {remaining}</p>
          <div style={{
                maxWidth: '600px',
                textAlign: 'center',
          }}>
            {'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => (
              <button 
                key={letter} 
                onClick={() => handleGuess(letter)} 
                disabled={guesses.includes(letter) || gameOver}
                style={{
                    border: '1px solid #ccc',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    margin: '0.5rem',
                    minWidth: '40px',
                }}
            >
                {letter}
              </button>
            ))}
          </div>
          {gameOver && (
            <div style={{
                position: "absolute",
                height: "100vh",
                width: "100vw",
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(5px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
                color: "#fff"
            }}>
                <div style={{
                    padding: "2rem",
                    backgroundColor: "#333",
                    borderRadius: "10px",
                    textAlign: "center"
                }}>
                    <h3>{win ? 'Congratulations! You won!' : 'Game Over! Try again.'}</h3>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                       {win && (
  <Web3Button
    style={{
      border: "1px solid #ccc",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      fontSize: "0.8rem",
      cursor: prizeClaimed ? "not-allowed" : "pointer", // Change cursor based on prizeClaimed state
      margin: "0.5rem",
      width: "100%",
    }}
    contractAddress={TOKEN_CONTRACT_ADDRESS}
    action={async (contract) => {
      setClaimingPrize(true);
      try {
        await contract.erc20.claim(claimAmount);
        setPrizeClaimed(true); // Set prizeClaimed to true after successful claim
      } catch (error) {
        console.error("Error claiming prize:", error);
      }
      setClaimingPrize(false);
    }}
    isDisabled={prizeClaimed} // Disable button based on prizeClaimed state
  >
    {claimingPrize ? 'Claiming...' : prizeClaimed ? 'Claimed' : 'Claim Token'}
  </Web3Button>
)}

                        <button 
                            onClick={resetGame}
                            style={{
                                border: "1px solid #ccc",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                margin: "0.5rem",
                                width: "100%",
                            }}
                        >Restart Game</button>
                    </div>
                </div>
            </div>
          )}
        </>
      )}
        
    </div>
  );
};
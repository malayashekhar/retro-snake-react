import { useEffect, useState, useRef, useCallback } from "react";
import GamePieces from './GamePieces'

const GameState = () => {

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false)
    const [collision, setCollisionType] = useState("")

    const highScoreRef = useRef(0);

    const handleGameOver = useCallback((type) => {
        setGameOver(true);
        if(score > highScoreRef.current) {
            highScoreRef.current = score;  
        }
        setCollisionType(type);
    }, [score]);

    const handleResetGame = () => {
        setScore(0);
        setGameOver(false);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if(gameOver && e.key === "Enter") {
                handleResetGame();
            }
        }

        window.addEventListener("keydown", handleKeyPress);
    }, [gameOver])

    return (
        <>
            <p className="score">Score: {score}</p>
            <p className="high-score">High Score: {highScoreRef.current}</p>

            {
                gameOver && (
                    <div className="game-over">
                        <p>{collision==="self" ? "Game Over !!!" : "You Pressed ESC"}</p>
                        <p>Press Enter to Reset</p>
                    </div>
                )
            }

            {
                !gameOver && (
                    <GamePieces 
                    score={score}
                    setScore={setScore}
                    onGameOver={(type) => handleGameOver(type)}
                    />
                )
            }
        </>
    )

}

export default GameState;
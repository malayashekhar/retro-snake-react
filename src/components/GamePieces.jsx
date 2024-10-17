import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types";

const GamePieces = ({score, setScore, onGameOver}) => {

    const canvasRef = useRef();
    const currentDirection = useRef(null);
    const SNAKE_SPEED = 10;
    const [apple, setApple] = useState({x: 180, y:100});
    const [snake, setSnake] = useState([{x: 100, y:50}, {x: 95, y: 50}]);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const drawSnake = () => {
            snake.forEach((snakePark) => {
                ctx.beginPath();
                ctx.rect(snakePark.x, snakePark.y, 14, 14);
                ctx.fillStyle = "#00ff41";
                ctx.fill();
                ctx.closePath();
            })
        }

        const drawApple = () => {
            ctx.beginPath();
            ctx.rect(apple.x, apple.y, 14, 14);
            ctx.fillStyle = "#FF0000";
            ctx.fill();
            ctx.closePath();
        }

        const moveSnake = () => {
            if(direction) {
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const snakeHead = {x: newSnake[0].x, y: newSnake[0].y};
                    for(let i=newSnake.length-1 ; i>0 ; i--) {
                        newSnake[i].x = newSnake[i-1].x;
                        newSnake[i].y = newSnake[i-1].y;
                    }
                    switch(direction) {
                        case "right":
                            snakeHead.x += SNAKE_SPEED;
                            break;
                        case "left":
                            snakeHead.x -= SNAKE_SPEED;
                            break;
                        case "up":
                            snakeHead.y -= SNAKE_SPEED;
                            break;
                        case "down":
                            snakeHead.y += SNAKE_SPEED;
                            break;
                        default:
                            break;
                    }
                    newSnake[0] = snakeHead;
                    handleAppleCollision(newSnake);
                    handleWallReappearance(snakeHead);
                    handleBodyCollision(newSnake);
                    return newSnake;
                })
                currentDirection.current = direction;
            }
        }

        const handleAppleCollision = (newSnake) => {
            const snakeHead = newSnake[0];
            if(snakeHead.x === apple.x && snakeHead.y === apple.y) {
                setScore(score++);
                setApple({x: Math.floor((Math.random()*canvas.width) / SNAKE_SPEED) * SNAKE_SPEED, y: Math.floor((Math.random()*canvas.height) / SNAKE_SPEED) * SNAKE_SPEED});
                newSnake.push({x: newSnake[newSnake.length-1].x, y: newSnake[newSnake.length-1].y});
            }
        }

        const handleWallReappearance = (snakeHead) => {
            if(snakeHead.x >= canvas.width) {
                snakeHead.x = 0;
            } 
            else if(snakeHead.x < 0) {
                snakeHead.x = canvas.width - SNAKE_SPEED;
            }
            if(snakeHead.y >= canvas.height) {
                snakeHead.y = 0;
            } 
            else if(snakeHead.y < 0) {
                snakeHead.y = canvas.height - SNAKE_SPEED;
            }
        }

        const handleBodyCollision = (newSnake) => {
            const snakeHead = newSnake[0];
            for(let i=1 ; i<newSnake.length ; i++) {
                if(snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
                    onGameOver("self");
                }
            }
        }

        const handleKeyPressed = (e) => {
            switch(e.key) {
                case "ArrowRight":
                    if(currentDirection.current !== "left") { 
                        setDirection("right");
                    }
                    break;
                case "ArrowLeft":
                    if(currentDirection.current !== "right") { 
                        setDirection("left");
                    }
                    break;
                case "ArrowUp":
                    if(currentDirection.current !== "down") { 
                        setDirection("up");
                    }
                    break;
                case "ArrowDown":
                    if(currentDirection.current !== "up") { 
                        setDirection("down");
                    }
                    break;
                case "Escape": 
                    onGameOver("ESC");
                    break;
                default:
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyPressed);

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawApple();
            drawSnake();
            moveSnake();
        }, 75)

        return () => {
            clearInterval(interval);
        };

    }, [snake, direction])


    return (
        <div>
            <canvas className="gameCanvas" ref={canvasRef} width={750} height={420}></canvas>
        </div>
    )

}

GamePieces.propTypes = {
    score: PropTypes.number.isRequired,
    setScore: PropTypes.func.isRequired,
    onGameOver: PropTypes.func.isRequired,
};

export default GamePieces;
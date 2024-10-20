import React from "react";
import { Link } from "react-router-dom";

const GameMenu = () => {
  return (
    <div>
      <div className="pt-7 mockup-code">
        <pre data-prefix="$" className="flex justify-center"><code>Menu Des jeux</code></pre>
      </div>
      <div className='h-screen flex flex-col items-center justify-center'>
        <div className='mb-10 flex justify-center'>
          <Link to="/game/tetris">
            <button className='btn glass btn-primary'>
              TETRIS
            </button>
          </Link>
          <Link to="/game/pong">
            <button className='btn glass btn-accent ml-5'>
              PONG
            </button>
          </Link>
          <Link to="/game/snake">
            <button className='btn glass btn-warning ml-5'>
              SNAKE
            </button>
          </Link>
          <Link to="/game/2048">
            <button className='btn glass btn-secondary ml-5'>
              2048
            </button>
          </Link>
          <Link to="/game/pfc">
            <button className='btn glass btn-error ml-5'>
              P-F-C
            </button>
          </Link>
          <Link to="/game/flappybird">
            <button className='btn glass btn-success ml-5'>
              FLAPPY BIRD
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;

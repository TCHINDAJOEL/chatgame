import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import GameMenu from "./pages/games/GameMenu";
import SnakeGame from "./components/SnakeGame";
import PongGame from "./components/PongGame";
import { useState, useEffect } from "react";

const Game2048Iframe = ({ playerName }) => (
  <iframe
    src={`/2048/connection.html?playerName=${encodeURIComponent(playerName)}`} // Passer le nom du joueur via l'URL
    title="2048 Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameTetrisIframe = ({ playerName }) => (
  <iframe
    src={`/tetris/icon.html?playerName=${encodeURIComponent(playerName)}`}
    title="tetris Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameMemoryIframe = ({ playerName }) => (
  <iframe
    src={`/memory_card/index.html?playerName=${encodeURIComponent(playerName)}`}
    title="memory card Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameWhackIframe = ({ playerName }) => (
  <iframe
    src={`/whack_a_mole/index.html?playerName=${encodeURIComponent(playerName)}`}
    title="whack_a_mole"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GamePongIframe = ({ playerName }) => (
  <iframe
    src={`/pong/pong.html?playerName=${encodeURIComponent(playerName)}`}
    title="Pong Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameSnakeIframe = ({ playerName }) => (
  <iframe
    src={`/snake/snake.html?playerName=${encodeURIComponent(playerName)}`}
    title="whack_a_mole"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

function App() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedButton, setClickedButton] = useState(null);
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || "");

  useEffect(() => {
    // Afficher le bouton de retour au chat si l'utilisateur n'est pas sur la page d'accueil
    if (location.pathname !== '/') {
      setClickedButton(location.pathname);
    } else {
      setClickedButton(null);
    }
  }, [location.pathname]);

  const handleGameClick = (path) => {
    setClickedButton(path);
    navigate(path);
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {authUser && (
        <div className='flex justify-center'>
          {clickedButton !== '/game/tetris' && (
            <button onClick={() => handleGameClick(`/game/tetris?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-primary'>
              TETRIS
            </button>
          )}
          {clickedButton !== '/game/pong' && (
            <button onClick={() => handleGameClick(`/game/pong?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-accent ml-5'>
              PONG
            </button>
          )}
          {clickedButton !== '/game/snake' && (
            <button onClick={() => handleGameClick(`/game/snake?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-warning ml-5'>
              SNAKE
            </button>
          )}
          {clickedButton !== '/game/memory' && (
            <button onClick={() => handleGameClick(`/game/memory?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-info ml-5'>
              Memory Card
            </button>
          )}
          {clickedButton !== '/game/2048' && (
            <button onClick={() => handleGameClick(`/game/2048?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-secondary ml-5'>
              2048
            </button>
          )}
          {clickedButton !== '/game/whack' && (
            <button onClick={() => handleGameClick(`/game/whack?playerName=${encodeURIComponent(playerName)}`)} className='btn glass btn-error ml-5'>
              Whack-a-Mole
            </button>
          )}
          {clickedButton && (
            <button
              onClick={() => navigate('/')}
              className='btn btn-outline btn-success ml-5'
            >
              Retour au Chat
            </button>
          )}
        </div>
      )}
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
        <Route path='/games' element={authUser ? <GameMenu /> : <Navigate to={"/login"} />} />
        {/*<Route path='/game/snake' element={authUser ? <SnakeGame playerName={playerName} /> : <Navigate to={"/login"} />} /> */}
        {/*<Route path='/game/pong' element={authUser ? <PongGame playerName={playerName} /> : <Navigate to={"/login"} />} /> */}
        <Route path='/game/pong' element={<GamePongIframe playerName={playerName} />} /> {/* Affiche le jeu pong dans l'iframe */}
        <Route path='/game/snake' element={<GameSnakeIframe playerName={playerName} />} /> {/* Affiche le jeu snake dans l'iframe */}
        <Route path='/game/2048' element={<Game2048Iframe playerName={playerName} />} /> {/* Affiche le jeu 2048 dans l'iframe */}
        <Route path='/game/tetris' element={<GameTetrisIframe playerName={playerName} />} /> {/* Affiche le jeu tetris dans l'iframe */}
        <Route path='/game/memory' element={<GameMemoryIframe playerName={playerName} />} /> {/* Affiche le jeu memory dans l'iframe */}
        <Route path='/game/whack' element={<GameWhackIframe playerName={playerName} />} /> {/* Affiche le jeu whack dans l'iframe */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
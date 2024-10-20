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

const Game2048Iframe = () => (
  <iframe
    src="/2048/game.html" // Assurez-vous que game.html est placé dans public/2048
    title="2048 Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameTetrisIframe = () => (
  <iframe
    src="/tetris/icon.html"
    title="tetris Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameMemoryIframe = () => (
  <iframe
    src="/memory_card/index.html"
    title="memory card Game"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

const GameWhackIframe = () => (
  <iframe
    src="/whack_a_mole/index.html"
    title="whack_a_mole"
    style={{ width: '100%', height: '100vh', border: 'none' }}
  />
);

function App() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedButton, setClickedButton] = useState(null);

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
      <div className='flex justify-center'>
        {clickedButton !== '/game/tetris' && (
          <button onClick={() => handleGameClick('/game/tetris')} className='btn glass btn-primary'>
            TETRIS
          </button>
        )}
        {clickedButton !== '/game/pong' && (
          <button onClick={() => handleGameClick('/game/pong')} className='btn glass btn-accent ml-5'>
            PONG
          </button>
        )}
        {clickedButton !== '/game/snake' && (
          <button onClick={() => handleGameClick('/game/snake')} className='btn glass btn-warning ml-5'>
            SNAKE
          </button>
        )}
        {clickedButton !== '/game/memory' && (
          <button onClick={() => handleGameClick('/game/memory')} className='btn glass btn-info ml-5'>
            Memory Card
          </button>
        )}
        {clickedButton !== '/game/2048' && (
          <button onClick={() => handleGameClick('/game/2048')} className='btn glass btn-secondary ml-5'>
            2048
          </button>
        )}
        {clickedButton !== '/game/whack' && (
          <button onClick={() => handleGameClick('/game/whack')} className='btn glass btn-error ml-5'>
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
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
        <Route path='/games' element={authUser ? <GameMenu /> : <Navigate to={"/login"} />} />
        <Route path='/game/snake' element={authUser ? <SnakeGame /> : <Navigate to={"/login"} />} />
        <Route path='/game/pong' element={authUser ? <PongGame /> : <Navigate to={"/login"} />} />
        <Route path='/game/2048' element={<Game2048Iframe />} /> {/* Affiche le jeu 2048 dans l'iframe */}
        <Route path='/game/tetris' element={<GameTetrisIframe />} /> {/* Affiche le jeu tetris dans l'iframe */}
        <Route path='/game/memory' element={<GameMemoryIframe />} /> {/* Affiche le jeu memory dans l'iframe */}
        <Route path='/game/whack' element={<GameWhackIframe />} /> {/* Affiche le jeu whack dans l'iframe */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
import "./StartScreen.css";

const StartScreen = ({ startGame }) => {
  return (
    <div className="start">
      <h1>Secret Word</h1>
      <p>Click in the button bellow to start playing!</p>
      <button onClick={startGame}>Start</button>
    </div>
  );
};

export default StartScreen;

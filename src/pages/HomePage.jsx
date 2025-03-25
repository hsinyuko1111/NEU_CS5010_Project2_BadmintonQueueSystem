import BaseTemplate from "../components/BaseTemplate.jsx";
import "../assets/style/HomePage.css";

export default function HomePage() {
  return (
    <BaseTemplate>
      <div className="homepage-container">
        <h1>Welcome, Little 🥬🐥!</h1>
        <p className="intro-text">
        This app is built to help create a <strong>fair and fun lining system</strong> — so everyone gets a turn, and nobody is left out! 💚  
        Below are a few simple steps and rules to help you get started:
        </p>

        <ul className="instructions">
          <li>👉 <strong>If you're not a registered user, please <a href="/register">register</a> first.</strong></li>
          <li>✅ Already registered? Don't forget to <a href="/login">check in</a> before joining a game.</li>
          <li>⏱ <strong>Timer Mode:</strong> You’ll have <strong>20 minutes</strong> to play. Focus and have fun!</li>
          <li>🎮 <strong>Match Mode:</strong> Compete in <strong>2–3 rounds</strong> until there's a clear winner.</li>
        </ul>

        <p className="encouragement">
          🌟 Be kind, play fair, and cheer each other on!  
          <br />
          You're doing great — let’s have an awesome session together! 💪🎉
        </p>
      </div>
    </BaseTemplate>
  );
}

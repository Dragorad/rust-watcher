import {StartScreen} from "./components/StartScreen"
import { invoke } from "@tauri-apps/api/core";
import {WatcherProvider} from "./context/WatcherContext";
import "./App.css";

function App() {
  return (
    // <WatcherProvider>
       <StartScreen />
  //  </WatcherProvider>
  );
}

export default App;

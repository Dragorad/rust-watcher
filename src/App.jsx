import {StartScreen} from "./components/StartScreen"
import { invoke } from "@tauri-apps/api/core";
import {ConfigProvider} from "./context/ConfigContext";
import "./App.css";

function App() {
  return (
    <ConfigProvider>
       <StartScreen />
   </ConfigProvider>
  );
}

export default App;

import React from 'react';
import appStyle from "./App.module.css"
import Game from './game/Game';
import {initializeIcons} from "@uifabric/icons"


const App: React.FunctionComponent = () => {
  initializeIcons();
  return (
    <div className={appStyle.body}>
      <Game />
    </div>
  )
    
};
export default App
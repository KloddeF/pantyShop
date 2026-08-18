import React, { createContext } from 'react';

import Store from './services/Store/Store';
import Server from './services/server/Server';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageManager from './pages/PageManager';
import useMediator from './services/Mediator/useMediator';
import Mediator from './services/Mediator/Mediator';

import './App.css';

export const MediatorContext = createContext<Mediator>(null!);
export const ServerContext = createContext<Server>(null!);

const App: React.FC = () => {
  // mediator
  const mediator = useMediator();
  const store = new Store(mediator);
  const server = new Server(mediator);

  server.check('ВАСИЛИЙ', 'Я на такое не подписывался!');

  return (
    <MediatorContext value={mediator}>
      <ServerContext.Provider value={server}>
        <div className="App">
          <div className='app'>
            <Header />
            <PageManager />
            <Footer />
          </div>
        </div>
      </ServerContext.Provider>
    </MediatorContext>
  );
}

export default App;

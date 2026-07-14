import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu';
import Login from './components/login';

//React toastify
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Menu/>
      </BrowserRouter>
      <ToastContainer/>
    </div>
  );
}

export default App;

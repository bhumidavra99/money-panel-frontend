import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Allroutes from './routes/Allroutes';
function App() {
  return (
    <BrowserRouter>
    <Allroutes />
  </BrowserRouter>
  );
}

export default App;

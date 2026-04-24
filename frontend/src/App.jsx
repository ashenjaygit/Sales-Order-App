import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SalesOrderScreen from './pages/SalesOrderScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        <header className="bg-blue-600 text-white shadow-md p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">SPIL Labs - Sales Orders</h1>
        </header>

        <main className="flex-grow p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<SalesOrderScreen />} />
            <Route path="/order/:id" element={<SalesOrderScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

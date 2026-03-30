import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import HomeBootstrap from './components/bootstrap/HomeBootstrap';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeBootstrap />} />
                <Route path="/b/:boardId" element={<BoardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from '@/shared/components/ui/toast';
import BoardPage from './pages/BoardPage';
import HomeBootstrap from './pages/HomeBootstrap';

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomeBootstrap />} />
                    <Route path="/b/:boardId" element={<BoardPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;

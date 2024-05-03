import { Routes, Route } from 'react-router-dom';
import { JoiningPage } from '../components/battle_ground/JoiningPage.jsx';

const AllRoutes = () => {
    return <>
        <Routes>
            <Route path='/' element={<JoiningPage/>} />
        </Routes>
    </>
}

export default AllRoutes;
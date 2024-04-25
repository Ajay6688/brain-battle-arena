import { Routes, Route } from 'react-router-dom';
import { JoiningPage } from '../components/battle_ground/JoiningPage';

const AllRoutes = () => {
    return <>
        <Routes>
            <Route exact path='/' element={< JoiningPage />}>
            </Route>
        </Routes>
    </>
}

export default AllRoutes;
import { Routes, Route } from 'react-router-dom';
import { JoiningPage } from '../components/battle_ground/JoiningPage';
import { QuestionsCategory } from '../components/questions_categories';

const AllRoutes = () => {
    return <>
        <Routes>
            {/* <Route path='/' element={<QuestionsCategory/>} /> */}
            <Route path='/' element={< JoiningPage />}/>
        </Routes>
    </>
}

export default AllRoutes;
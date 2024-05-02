import { Routes, Route } from 'react-router-dom';
import { JoiningPage } from '../components/battle_ground/JoiningPage2.jsx';
import { QuestionsCategory } from '../components/questions_categories';

const AllRoutes = () => {
    return <>
        <Routes>
            <Route path='/category' element={<QuestionsCategory />} />
            <Route path='/:category' element={<JoiningPage />}/>
            <Route path='/' element={<JoiningPage/>} />
        </Routes>
    </>
}

export default AllRoutes;
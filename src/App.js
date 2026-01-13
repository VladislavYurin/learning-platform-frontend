import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/ui/ProtectedRoute';
import RoleRoute from './components/ui/RoleRoute';
import UserDashboard from './pages/user/UserDashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import AdminPanel from './pages/admin/AdminPanel';
import CoursePage from './pages/courses/CoursePage';
import ModulePage from './pages/courses/ModulePage';
import MentorCoursePage from './pages/mentor/MentorCoursePage';
import MyProfilePage from "./pages/user/MyProfilePage";
import MentorProfilePage from "./pages/mentor/MentorProfilePage";
import MentorModulePage from "./pages/mentor/MentorModulePage";
import MentorModuleEditorPage from "./pages/mentor/MentorModuleEditorPage";
import MentorStatsPage from "./pages/mentor/MentorStatsPage";
import MentorCoursesPage from "./pages/mentor/MentorCoursesPage";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<HomePage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>

                        <Route path="user" element={<ProtectedRoute/>}>
                            <Route index element={<UserDashboard/>}/>
                            <Route path="profile" element={<MyProfilePage/>}/>
                            <Route path="courses/:courseId" element={<CoursePage/>}/>
                            <Route path="courses/:courseId/modules/:moduleId" element={<ModulePage/>}/>
                        </Route>

                        <Route path="mentor" element={<RoleRoute allowedRoles={["MENTOR"]}/>}>
                            <Route index element={<MentorDashboard/>}/>
                            <Route path="profile" element={<MentorProfilePage/>}/>

                            <Route path="courses" element={<MentorCoursesPage/>}/>
                            <Route path="courses/:courseId" element={<MentorCoursePage/>}/>
                            <Route path="courses/:courseId/modules/:moduleId" element={<MentorModulePage/>}/>
                            <Route path="courses/:courseId/modules/:moduleId/edit" element={<MentorModuleEditorPage/>}/>

                            <Route path="stats" element={<MentorStatsPage/>}/>
                        </Route>


                        <Route path="admin" element={<RoleRoute allowedRoles={['ADMIN']}/>}>
                            <Route index element={<AdminPanel/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;

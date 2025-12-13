import { Route, Routes } from "react-router-dom";
import CreateProject from "./pages/CreateProject";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import MyProjectsPage from "./pages/MyProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import Quiz from "./pages/Quiz";
import Register from "./pages/Register";
import Sandbox from "./pages/Sandbox";
import CreateSpeedSorting from "./pages/speed-sorting/CreateSpeedSorting";
import EditSpeedSorting from "./pages/speed-sorting/EditSpeedSorting";
import SpeedSorting from "./pages/speed-sorting/SpeedSorting";
import ProtectedRoute from "./routes/ProtectedRoutes";
import CreateAnagram from "./pages/Anagram/CreateAnagram";
import PlayAnagram from "./pages/Anagram/PlayAnagram";
import EditAnagram from "./pages/Anagram/EditAnagram";

import PairOrNoPairGame from "./pages/pair-or-no-pair";
import CreatePairOrNoPair from "./pages/pair-or-no-pair/create";
import CreateTrueOrFalse from "./pages/true-or-false/CreateTrueOrFalse";
import EditTrueOrFalse from "./pages/true-or-false/EditTrueOrFalse";
import PlayTrueOrFalse from "./pages/true-or-false/TrueOrFalse";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/quiz/play/:id" element={<Quiz />} />
        <Route path="/speed-sorting/play/:id" element={<SpeedSorting />} />
        <Route path="/anagram/play/:id" element={<PlayAnagram />} />
        <Route
          path="/pair-or-no-pair/play/:gameId"
          element={<PairOrNoPairGame />}
        />
        <Route path="/true-or-false/play/:id" element={<PlayTrueOrFalse />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/create-projects" element={<CreateProject />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route
            path="/create-speed-sorting"
            element={<CreateSpeedSorting />}
          />
          <Route
            path="/create-pair-or-no-pair"
            element={<CreatePairOrNoPair />}
          />
          <Route path="/quiz/edit/:id" element={<EditQuiz />} />
          <Route
            path="/speed-sorting/edit/:id"
            element={<EditSpeedSorting />}
          />
          <Route path="/create-anagram" element={<CreateAnagram />} />
          <Route path="/anagram/edit/:id" element={<EditAnagram />} />
          <Route path="/create-true-or-false" element={<CreateTrueOrFalse />} />
          <Route path="/true-or-false/edit/:id" element={<EditTrueOrFalse />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";
import LoveChallengesPage from "./pages/LoveChallengesPage";
import MidnightPage from "./pages/MidnightPage";

import HomePage from "./pages/HomePage";

import ObservatoryPage from "./pages/ObservatoryPage";
import ChapterPage from "./pages/ChapterPage";

import LettersPage from "./pages/LettersPage";
import LetterCollectionPage from "./pages/LetterCollectionPage";
import LetterPage from "./pages/LetterPage";

import QuizCollectionPage from "./pages/QuizCollectionPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import QuizAttemptPage from "./pages/QuizAttemptPage";
import QuizResultPage from "./pages/QuizResultPage";

import MemoriesPage from "./pages/MemoriesPage";

import BucketCollectionPage from "./pages/BucketCollectionPage";
import BucketDetailPage from "./pages/BucketDetailPage";

import RomancePage from "./pages/RomancePage";
import HeartPromptPage from "./pages/HeartPromptPage";
import HeartJournalPage from "./pages/HeartJournalPage";
import FutureDreamsPage from "./pages/FutureDreamsPage";

import GardenPage from "./pages/GardenPage";

import UniverseLayout from "./layouts/UniverseLayout";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Universe */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/verify"
          element={<VerifyPage />}
        />

        {/* Astra Universe */}

        <Route
          element={<UniverseLayout />}
        >

          <Route
            path="/home"
            element={<HomePage />}
          />

          {/* Observatory */}

          <Route
            path="/observatory"
            element={<ObservatoryPage />}
          />

          <Route
            path="/observatory/:chapter"
            element={<ChapterPage />}
          />

          {/* Letters */}

          <Route
            path="/letters"
            element={<LettersPage />}
          />

          <Route
            path="/letters/:category"
            element={<LetterCollectionPage />}
          />

          <Route
            path="/letters/:category/:letterId"
            element={<LetterPage />}
          />

          {/* Quiz */}

          <Route
            path="/quiz"
            element={<QuizCollectionPage />}
          />

          <Route
            path="/quiz/create"
            element={<CreateQuizPage />}
          />

          <Route
            path="/quiz/result/:quizId"
            element={<QuizResultPage />}
          />

          <Route
            path="/quiz/:quizId"
            element={<QuizAttemptPage />}
          />

          {/* Bucket List */}

          <Route
            path="/bucket-list"
            element={<BucketCollectionPage />}
          />

          <Route
            path="/bucket-list/:bucketId"
            element={<BucketDetailPage />}
          />

          {/* Other Realms */}

          <Route
            path="/memories"
            element={<MemoriesPage />}
          />

          {/* Romance */}

          <Route
            path="/romance"
            element={<RomancePage />}
          />

          <Route
            path="/romance/heart-prompt"
            element={<HeartPromptPage />}
          />

          <Route
            path="/romance/heart-journal"
            element={<HeartJournalPage />}
          />

          <Route
            path="/romance/future-dreams"
            element={<FutureDreamsPage />}
          />

          <Route
  path="/romance/love-challenges"
  element={<LoveChallengesPage />}
/>

<Route
  path="/romance/late-night"
  element={<MidnightPage />}
/>

          {/* Garden */}

          <Route
            path="/garden"
            element={<GardenPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";



import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import VerifyPage from "./pages/VerifyPage";


import HomePage from "./pages/HomePage";


import ObservatoryPage from "./pages/ObservatoryPage";
import ChapterPage from "./pages/ChapterPage";


import LettersPage from "./pages/LettersPage";
import LetterCollectionPage from "./pages/LetterCollectionPage";


import QuizPage from "./pages/QuizPage";
import QuizCategoryPage from "./pages/QuizCategoryPage";


import MemoriesPage from "./pages/MemoriesPage";
import BucketListPage from "./pages/BucketListPage";
import RomancePage from "./pages/RomancePage";
import GardenPage from "./pages/GardenPage";


import UniverseLayout from "./layouts/UniverseLayout";








function App(){



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









          {/* Quiz */}



          <Route

            path="/quiz"

            element={<QuizPage />}

          />



          <Route

            path="/quiz/:category"

            element={<QuizCategoryPage />}

          />









          {/* Other Realms */}



          <Route

            path="/memories"

            element={<MemoriesPage />}

          />



          <Route

            path="/bucket-list"

            element={<BucketListPage />}

          />



          <Route

            path="/romance"

            element={<RomancePage />}

          />



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
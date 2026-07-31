import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  auth,
  db
} from "../firebase/firebaseConfig";

import FloatingPuzzleBackground from "../components/FloatingPuzzleBackground";
import HomeButton from "../components/HomeButton";



function QuizCollectionPage(){


  const navigate = useNavigate();



  const [quizzes,setQuizzes] =

    useState<any[]>([]);



  const [currentUser,setCurrentUser] =

    useState<any>(null);



  const [starName,setStarName] =

    useState("");



  const [loading,setLoading] =

    useState(true);

  const [activeFilter,setActiveFilter] =

    useState<"all" | "eraya" | "icarus" | "completed">("all");









  useEffect(()=>{


    const unsubscribe =

      onAuthStateChanged(

        auth,

        async(user)=>{


          setCurrentUser(user);



          if(user){


            const userSnap =

              await getDoc(

                doc(

                  db,

                  "users",

                  user.uid

                )

              );



            if(userSnap.exists()){


              const data =

                userSnap.data();



              setStarName(

                (

                  data.starName || ""

                )

                .toLowerCase()

              );


            }


          }


        }

      );



    return ()=>unsubscribe();



  },[]);









  useEffect(()=>{


    const quizQuery = query(


      collection(

        db,

        "quizzes"

      ),


      orderBy(

        "createdAt",

        "desc"

      )


    );




    const unsubscribe =

      onSnapshot(


        quizQuery,


        snapshot=>{


          const data =


            snapshot.docs.map(doc=>({


              id:doc.id,


              ...doc.data()


            }));



          setQuizzes(data);


          setLoading(false);



        },



        error=>{


          console.error(

            "Quiz listener error:",

            error

          );


          setLoading(false);


        }


      );




    return ()=>unsubscribe();



  },[]);









  function getTheme(author:string){



    if(

      author?.toLowerCase()

      ===

      "eraya"

    ){


      return {


        border:

        "border-pink-300/40",


        bg:

        "bg-pink-500/5"


      };


    }



    return {


      border:

      "border-blue-300/40",


      bg:

      "bg-blue-500/5"


    };


  }









  function getQuizType(type:string){


    if(type==="romance")

      return "💗 ROMANCE";


    if(type==="dark-romance")

      return "🔥 DARK ROMANCE";


    return "⭐ NORMAL";


  }









  function isReceiver(quiz:any){


    return (

      quiz.receiver

      ?.toLowerCase()

      ===

      starName

    );


  }









  function isAuthor(quiz:any){


    return (

      quiz.authorId

      ===

      currentUser?.uid

    );


  }









  function getCompletedResult(quiz:any){
    const currentUserId = currentUser?.uid;

    if(!currentUserId) return null;

    const completedBy = Array.isArray(quiz.completedBy) ? quiz.completedBy : [];

    const personalResult = completedBy.find((entry:any) => entry.userId === currentUserId);
    if(personalResult) return personalResult;

    if(quiz.authorId === currentUserId && completedBy.length > 0) {
      return completedBy[completedBy.length - 1];
    }

    return null;
  }

  function isCompleted(quiz:any){
    const currentUserId = currentUser?.uid;

    if(!currentUserId) return false;

    const attemptedBy = Array.isArray(quiz.attemptedBy) ? quiz.attemptedBy : [];
    const completedBy = Array.isArray(quiz.completedBy) ? quiz.completedBy : [];

    if(attemptedBy.includes(currentUserId)) return true;

    if(quiz.authorId === currentUserId && completedBy.length > 0) return true;

    return false;

  }

  function getFilteredQuizzes() {
    const normalized = quizzes.filter((quiz:any) => {
      const authorName = (quiz.authorName || "").toLowerCase();

      if(activeFilter === "eraya") {
        return authorName === "eraya";
      }

      if(activeFilter === "icarus") {
        return authorName === "icarus";
      }

      if(activeFilter === "completed") {
        return isCompleted(quiz);
      }

      return true;
    });

    return normalized;
  }









  return (



    <div


      className="
        relative
        min-h-screen
        w-screen
        overflow-y-auto
        bg-black
        px-8
        pb-20
        pt-8
        text-white
      "


    >

      <FloatingPuzzleBackground />

      <div className="fixed left-8 top-8 z-[100]">
        <HomeButton label="Home" to="/home" />
      </div>

      <div className="
        mx-auto
        max-w-5xl
      ">





        <div className="
          text-center
        ">


          <div className="flex items-center justify-center gap-3">

            <h1 className="
              text-3xl
              font-light
              tracking-[0.3em]
              sm:text-4xl
            ">

              QUIZZES

            </h1>

            <div className="text-4xl sm:text-5xl">

              🧩

            </div>

          </div>



          <p className="
            mt-5
            text-xs
            tracking-[0.5em]
            text-purple-300
          ">

            QUESTIONS WRITTEN AMONG STARS

          </p>

          <p className="
            mx-auto
            mt-8
            max-w-xl
            text-sm
            leading-relaxed
            text-white/70
            sm:text-base
          ">

            Discover playful prompts, heartfelt questions, and little cosmic challenges for your love story.

          </p>


        </div>








        {

          loading && (


            <p className="
              mt-20
              text-center
              text-white/50
            ">

              Discovering quizzes...

            </p>


          )

        }









        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { key: "all", label: "All Quizzes" },
            { key: "eraya", label: "Created by Eraya" },
            { key: "icarus", label: "Created by Icarus" },
            { key: "completed", label: "Completed Quizzes" }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.3em] transition ${
                activeFilter === filter.key
                  ? "border-purple-300/40 bg-purple-500/20 text-purple-100"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="
          mt-10
          space-y-8
        ">



        {

          getFilteredQuizzes().map(quiz=>{


            const theme =

              getTheme(

                quiz.authorName

              );



            const author =

              isAuthor(quiz);



            const receiver =

              isReceiver(quiz);



            const completed =

              isCompleted(quiz);

            const completedResult = getCompletedResult(quiz);





            return (



              <div


                key={quiz.id}


                className={`

                  rounded-3xl

                  border

                  p-6 md:p-10

                  ${theme.border}

                  ${theme.bg}

                `}



              >












                <h2 className="
                  
                  text-3xl
                  font-light
                ">

                  {quiz.title}

                </h2>







                <div className="
                  mt-5
                  flex
                  flex-wrap
                  gap-3
                ">



                  <span className="
                    rounded-full
                    border
                    border-white/10
                    px-3
                    py-1
                    text-xs
                  ">

                    {getQuizType(quiz.type)}

                  </span>



                  <span className="
                    rounded-full
                    border
                    border-white/10
                    px-3
                    py-1
                    text-xs
                  ">

                    ⭐ {quiz.reward}

                  </span>



                </div>







                <p className="
                  mt-6
                  text-white/60
                ">


                  Created by {quiz.authorName}


                </p>
























                {

                  completed && (


                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <p className="
                        text-xs
                        tracking-widest
                        text-green-300
                      ">

                        ✓ COMPLETED

                      </p>

                      <button
                        onClick={()=>navigate(`/quiz/result/${quiz.id}`, {
                          state:{
                            score: completedResult?.score || 0,
                            reward: completedResult?.reward || quiz.reward || 0,
                            quiz,
                            answers: completedResult?.answers || []
                          }
                        })}
                        className="
                          cursor-pointer
                          rounded-full
                          border
                          border-white/20
                          px-4
                          py-2
                          text-[10px]
                          uppercase
                          tracking-[0.3em]
                          text-white/80
                          transition
                          hover:bg-white/10
                        "
                      >
                        VIEW RESULTS
                      </button>
                    </div>


                  )

                }









                {

                  receiver && !completed && (


                    <button


                      onClick={()=>navigate(

                        `/quiz/${quiz.id}`

                      )}



                      className="
                        mt-8
                        ml-auto
                        block
                        cursor-pointer
                        rounded-full
                        border
                        border-green-300/30
                        bg-green-500/10
                        px-8
                        py-3
                        text-xs
                        tracking-[0.35em]
                        text-green-200
                        transition
                        hover:bg-green-500/20
                      "


                    >

                      START QUIZ ✨


                    </button>


                  )

                }





              </div>


            );


          })

        }


        </div>





      </div>



      <button


        onClick={()=>navigate("/quiz/create")}



        className="fixed bottom-20 md:bottom-28 right-4 md:right-8 z-50 cursor-pointer rounded-full border border-purple-300/30 bg-purple-500/10 px-3 md:px-4 py-3 md:py-4 text-xs tracking-[0.4em] transition hover:bg-purple-500/20"


      >

        + CREATE QUIZ 🧩


      </button>





    </div>


  );

}



export default QuizCollectionPage;
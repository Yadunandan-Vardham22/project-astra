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









  function isCompleted(quiz:any){


    return quiz.attemptedBy

    ?.includes(

      currentUser?.uid

    );


  }









  return (



    <div


      className="
        min-h-screen
        bg-black
        px-8
        py-20
        text-white
      "


    >



      <div className="
        mx-auto
        max-w-5xl
      ">





        <div className="
          text-center
        ">


          <div className="text-6xl">

            🧩

          </div>



          <h1 className="
            mt-6
            text-5xl
            font-light
            tracking-[0.3em]
          ">

            QUIZZES

          </h1>



          <p className="
            mt-5
            text-xs
            tracking-[0.5em]
            text-purple-300
          ">

            QUESTIONS WRITTEN AMONG STARS

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









        <div className="
          mt-16
          space-y-8
        ">



        {

          quizzes.map(quiz=>{


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





            return (



              <div


                key={quiz.id}


                className={`

                  rounded-3xl

                  border

                  p-10

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

                  author && (


                    <p className="
                      mt-6
                      text-xs
                      tracking-widest
                      text-white/40
                    ">

                      CREATED BY YOU

                    </p>


                  )

                }








                {

                  author && (


                    <p className="
                      mt-3
                      text-xs
                      text-white/40
                    ">

                      You cannot take your own quiz

                    </p>


                  )

                }









                {

                  completed && (


                    <p className="
                      mt-6
                      text-xs
                      tracking-widest
                      text-green-300
                    ">

                      ✓ COMPLETED

                    </p>


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



        className="
          fixed
          bottom-28
          right-8
          z-50
          cursor-pointer
          rounded-full
          border
          border-purple-300/30
          bg-purple-500/10
          px-4
          py-4
          text-xs
          tracking-[0.4em]
          transition
          hover:bg-purple-500/20
        "


      >

        + CREATE QUIZ 🧩


      </button>





    </div>


  );

}



export default QuizCollectionPage;
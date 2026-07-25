import {
  useEffect,
  useState
} from "react";


import {
  useNavigate,
  useParams
} from "react-router-dom";


import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  increment
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  auth,
  db
} from "../firebase/firebaseConfig";








function QuizAttemptPage(){



  const {
    quizId
  } = useParams();



  const navigate = useNavigate();





  const [user,setUser] =

    useState<any>(null);



  const [quiz,setQuiz] =

    useState<any>(null);



  const [loading,setLoading] =

    useState(true);





  const [blockedMessage,setBlockedMessage] =

    useState("");





  const [currentQuestion,setCurrentQuestion] =

    useState(0);





  const [answers,setAnswers] =

    useState<any[]>([]);





  const [error,setError] =

    useState("");





  const [submitting,setSubmitting] =

    useState(false);









  useEffect(()=>{


    const unsubscribe =

      onAuthStateChanged(

        auth,

        user=>{


          setUser(user);


        }

      );



    return ()=>unsubscribe();



  },[]);









  useEffect(()=>{


    if(user)

      fetchQuiz();



  },[user]);












  async function fetchQuiz(){



    if(!quizId || !user)

      return;



    try{


      const snapshot =

        await getDoc(



          doc(

            db,

            "quizzes",

            quizId

          )



        );





      if(snapshot.exists()){


        const data: any = {


          id:snapshot.id,


          ...snapshot.data()


        };





        /*
          Creator cannot take own quiz
        */


        if(

          data.authorId === user.uid

        ){



          setBlockedMessage(

            "You cannot take your own quiz ✦"

          );


          setLoading(false);


          return;


        }









        /*
          User can attempt only once
        */


        if(

          data.attemptedBy

          ?.includes(

            user.uid

          )

        ){



          setBlockedMessage(

            "You have already completed this quiz ✦"

          );


          setLoading(false);


          return;


        }






        setQuiz(data);





        setAnswers(

          new Array(

            data.questions.length

          )

          .fill(null)

        );



      }



    }

    catch(error){



      console.error(

        "Quiz loading error",

        error

      );



    }

    finally{


      setLoading(false);


    }



  }













  function updateAnswer(

    value:any

  ){



    setAnswers(prev=>{


      const copy=[...prev];


      copy[currentQuestion]=value;


      return copy;


    });



  }













  function toggleMultipleAnswer(

    option:string

  ){



    const existing =

      answers[currentQuestion] || [];





    if(

      existing.includes(option)

    ){



      updateAnswer(

        existing.filter(

          (item:string)=>

          item!==option

        )

      );


    }

    else{


      updateAnswer([

        ...existing,

        option

      ]);



    }



  }













  function moveOrderItem(

    index:number,

    direction:number

  ){



    const current =

      [

        ...(answers[currentQuestion] || [])

      ];





    const newIndex =

      index + direction;





    if(

      newIndex < 0 ||

      newIndex >= current.length

    )

      return;





    [

      current[index],

      current[newIndex]

    ] =

    [

      current[newIndex],

      current[index]

    ];





    updateAnswer(current);



  }

    function calculateScore(){


    let score = 0;



    quiz.questions.forEach(

      (question:any,index:number)=>{


        const answer =

          answers[index];





        if(question.type==="mcq"){


          if(

            answer ===

            question.correctAnswer

          ){

            score++;

          }


        }







        if(question.type==="multiple-answer"){



          const selected =

            [

              ...(answer || [])

            ]

            .sort();





          const correct =

            [

              ...question.correctAnswers

            ]

            .sort();





          if(

            JSON.stringify(selected)

            ===

            JSON.stringify(correct)

          ){

            score++;

          }


        }







        if(question.type==="order"){



          if(

            JSON.stringify(answer)

            ===

            JSON.stringify(

              question.correctOrder

            )

          ){

            score++;

          }


        }



      }


    );




    return score;



  }













  async function submitQuiz(){



    if(

      answers.includes(null)

    ){



      setError(

        "Please answer all questions"

      );


      return;


    }







    try{



      setSubmitting(true);





      const score =

        calculateScore();





      const reward =

        quiz.reward;









      await updateDoc(



        doc(

          db,

          "quizzes",

          quiz.id

        ),



        {



          attemptedBy:

            arrayUnion(

              user.uid

            ),






          completedBy:

            arrayUnion(


              {


                userId:user.uid,


                score,


                totalQuestions:

                  quiz.totalQuestions,


                reward,

                completedAt:

                  new Date()


              }


            )



        }



      );









      const stardustRef =

        doc(

          db,

          "stardust",

          user.uid

        );







      await setDoc(

        stardustRef,

        {


          total:

            increment(

              reward

            )


        },


        {


          merge:true


        }

      );









      navigate(

        `/quiz/result/${quiz.id}`,

        {


          state:{


            score,

            reward


          }


        }


      );





    }

    catch(error){


      console.error(

        "Quiz submit error",

        error

      );


      setError(

        "Unable to submit quiz"

      );


    }

    finally{


      setSubmitting(false);


    }



  }













  if(loading){


    return (


      <div className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        text-white
      ">

        Loading quiz...

      </div>


    );


  }











  if(blockedMessage){


    return (


      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
        text-center
      ">


        <div>


          <p className="
            text-xl
            text-purple-300
          ">

            {blockedMessage}

          </p>


          <button

            onClick={()=>navigate("/quiz")}

            className="
              mt-8
              cursor-pointer
              rounded-full
              border
              border-white/20
              px-8
              py-3
            "

          >

            BACK TO QUIZ

          </button>


        </div>


      </div>


    );


  }











  if(!quiz){


    return null;


  }









  const question =

    quiz.questions[currentQuestion];









  return (


    <div className="
      min-h-screen
      bg-black
      px-8
      py-20
      text-white
    ">



      <div className="
        mx-auto
        max-w-3xl
      ">





        <div className="text-center">


          <p className="
            text-xs
            tracking-[0.4em]
            text-purple-300
          ">


            QUESTION {currentQuestion+1}

            /

            {quiz.totalQuestions}


          </p>



        </div>







        <div className="
          mt-12
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-10
        ">



          <h1 className="
            text-3xl
            font-light
          ">

            {question.question}

          </h1>





          <p className="
            mt-4
            text-xs
            tracking-[0.25em]
            text-purple-300/80
          ">


            {

              question.type==="mcq"

              &&

              "✦ SELECT ONE ANSWER"


            }



            {

              question.type==="multiple-answer"

              &&

              "✦ SELECT ONE OR MORE ANSWERS"


            }



            {

              question.type==="order"

              &&

              "✦ ARRANGE THE ITEMS IN THE CORRECT ORDER"


            }


          </p>









          {

            question.type!=="order"

            &&


            question.options?.map(

              (

                option:string,

                index:number

              )=>(



                <button


                  key={

                    `${option}-${index}`

                  }



                  onClick={()=>{


                    if(

                      question.type==="multiple-answer"

                    ){


                      toggleMultipleAnswer(option);


                    }

                    else{


                      updateAnswer(option);


                    }


                  }}



                  className={

                  `

                    mt-4

                    w-full

                    cursor-pointer

                    rounded-xl

                    border

                    p-4

                    text-left


                    ${

                    (

                    question.type==="multiple-answer"

                    ?

                    answers[currentQuestion]

                    ?.includes(option)

                    :

                    answers[currentQuestion]

                    ===option

                    )

                    ?

                    "border-purple-300 bg-purple-500/20"

                    :

                    "border-white/10"

                    }

                  `


                  }


                >

                  {option}

                </button>


              )

            )


          }












          {

            question.type==="order"

            &&


            question.items?.map(

              (

                item:string,

                index:number

              )=>(



                <div

                  key={

                    `${item}-${index}`

                  }

                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-white/10
                    p-4
                  "

                >


                  <span>

                    {index+1}. {item}

                  </span>





                  <div className="
                    flex
                    gap-3
                  ">



                    <button

                      onClick={()=>moveOrderItem(

                        index,

                        -1

                      )}

                      className="
                        cursor-pointer
                      "

                    >

                      ↑

                    </button>





                    <button

                      onClick={()=>moveOrderItem(

                        index,

                        1

                      )}

                      className="
                        cursor-pointer
                      "

                    >

                      ↓

                    </button>


                  </div>


                </div>


              )


            )


          }








        </div>









        {

          error && (


            <p className="
              mt-5
              text-center
              text-red-300
            ">

              {error}

            </p>


          )


        }








        <div className="
          mt-8
          flex
          gap-5
        ">



          {

            currentQuestion>0 && (


              <button

                onClick={()=>setCurrentQuestion(

                  currentQuestion-1

                )}

                className="
                  flex-1
                  cursor-pointer
                  rounded-full
                  border
                  border-white/20
                  py-4
                "

              >

                BACK

              </button>


            )


          }









          {

            currentQuestion <

            quiz.questions.length-1

            ?



            <button

              onClick={()=>setCurrentQuestion(

                currentQuestion+1

              )}

              className="
                flex-1
                cursor-pointer
                rounded-full
                border
                border-white/20
                py-4
              "

            >

              NEXT

            </button>



            :



            <button

              onClick={submitQuiz}

              disabled={submitting}

              className="
                flex-1
                cursor-pointer
                rounded-full
                border
                border-green-300/30
                bg-green-500/10
                py-4
                text-green-200
              "

            >

              {

                submitting

                ?

                "SUBMITTING..."

                :

                "SUBMIT QUIZ ✨"


              }


            </button>



          }


        </div>




      </div>


    </div>


  );


}



export default QuizAttemptPage;
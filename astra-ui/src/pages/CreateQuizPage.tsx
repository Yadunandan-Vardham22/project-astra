import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  addDoc,
  collection,
  serverTimestamp,
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
import BackButton from "../components/BackButton";







type QuestionType =

  | "mcq"

  | "multiple-answer"

  | "order";







interface Question {


  type:QuestionType;


  question:string;


  options:string[];


  correctAnswer?:string;


  correctAnswers?:string[];


  items?:string[];


  correctOrder?:string[];


}









function CreateQuizPage(){



  const navigate = useNavigate();





  const [user,setUser] =

    useState<any>(null);





  const [authorName,setAuthorName] =

    useState("");





  const [title,setTitle] =

    useState("");





  const [quizType,setQuizType] =

    useState("normal");





  const [reward,setReward] =

    useState(100);





  const [questionCount,setQuestionCount] =

    useState(5);





  const [questions,setQuestions] =

    useState<Question[]>([]);





  const [error,setError] =

    useState("");





  const [saving,setSaving] =

    useState(false);









  useEffect(()=>{


    const unsubscribe =

      onAuthStateChanged(

        auth,

        currentUser=>{


          setUser(currentUser);


        }

      );



    return ()=>unsubscribe();



  },[]);













  useEffect(()=>{


    if(!user)

      return;



    async function loadUser(){



      const snapshot =

        await getDoc(

          doc(

            db,

            "users",

            user.uid

          )

        );





      if(snapshot.exists()){


        const data =

          snapshot.data();



        setAuthorName(

          (

            data.starName || ""

          )

          .toLowerCase()

        );


      }


    }





    loadUser();



  },[user]);













  function createEmptyQuestion()

  :Question{


    return {


      type:"mcq",


      question:"",


      options:[

        "",

        "",

        ""

      ],


      correctAnswer:""


    };


  }













  function initializeQuestions(){



    const list:Question[]=[];



    for(

      let i=0;

      i<questionCount;

      i++

    ){


      list.push(

        createEmptyQuestion()

      );


    }





    setQuestions(list);



  }













  function updateQuestion(

    index:number,

    updated:Partial<Question>

  ){



    setQuestions(prev=>{


      const copy=[...prev];


      copy[index]={

        ...copy[index],

        ...updated

      };


      return copy;


    });



  }

  
  function changeQuestionType(

    index:number,

    type:QuestionType

  ){



    let question:Question;



    if(type==="mcq"){


      question={


        type,

        question:"",

        options:[

          "",

          "",

          ""

        ],

        correctAnswer:""


      };


    }



    else if(type==="multiple-answer"){


      question={


        type,

        question:"",

        options:[

          "",

          "",

          ""

        ],

        correctAnswers:[]


      };


    }



    else{


      question={


        type,

        question:"",

        options:[],



        items:[

          "",

          "",

          "",

          ""

        ],



        correctOrder:[

          "",

          "",

          "",

          ""

        ]


      };


    }





    setQuestions(prev=>{


      const copy=[...prev];


      copy[index]=question;


      return copy;


    });



  }













  function updateOption(

    qIndex:number,

    optionIndex:number,

    value:string

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      const duplicate =

        copy[qIndex]

        .options

        .some(

          (option,index)=>

            index!==optionIndex &&

            option.trim().toLowerCase()

            ===

            value.trim().toLowerCase()

            &&

            value.trim()!==""

        );





      if(duplicate){


        setError(

          "Duplicate options are not allowed"

        );


        return prev;


      }





      copy[qIndex]

      .options[optionIndex]=value;



      setError("");



      return copy;


    });



  }













  // New multiple answer logic

  // Clicking "Mark Correct" toggles this option



  function toggleCorrectAnswer(

    qIndex:number,

    option:string

  ){



    const cleanOption =

      option.trim();





    if(!cleanOption)

      return;





    setQuestions(prev=>{


      const copy=[...prev];



      const current =

        copy[qIndex]

        .correctAnswers || [];







      if(

        current.includes(cleanOption)

      ){



        copy[qIndex]

        .correctAnswers =

          current.filter(

            item=>

            item!==cleanOption

          );



      }

      else{



        copy[qIndex]

        .correctAnswers=[

          ...current,

          cleanOption

        ];



      }





      return copy;


    });



  }













  function updateOrderItem(

    qIndex:number,

    index:number,

    value:string

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      if(copy[qIndex].items){



        copy[qIndex]

        .items![index]=value;



      }



      return copy;


    });



  }













  function updateCorrectOrder(

    qIndex:number,

    index:number,

    value:string

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      if(copy[qIndex].correctOrder){



        copy[qIndex]

        .correctOrder![index]=value;



      }



      return copy;


    });



  }













  function moveCorrectOrderItem(

    qIndex:number,

    index:number,

    direction:number

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      const order =

        [

          ...(copy[qIndex].correctOrder || [])

        ];





      const newIndex =

        index + direction;





      if(

        newIndex < 0 ||

        newIndex >= order.length

      )

        return prev;





      [

        order[index],

        order[newIndex]

      ] =

      [

        order[newIndex],

        order[index]

      ];





      copy[qIndex]

      .correctOrder = order;



      return copy;


    });



  }













  function addOption(

    qIndex:number

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      if(

        copy[qIndex]

        .options

        .length < 6

      ){


        copy[qIndex]

        .options

        .push("");


      }



      return copy;


    });



  }













  function removeOption(

    qIndex:number,

    optionIndex:number

  ){



    setQuestions(prev=>{


      const copy=[...prev];



      if(

        copy[qIndex]

        .options

        .length > 3

      ){



        const removed =

          copy[qIndex]

          .options[optionIndex];





        copy[qIndex]

        .options

        .splice(

          optionIndex,

          1

        );





        copy[qIndex]

        .correctAnswers =

          copy[qIndex]

          .correctAnswers

          ?.filter(

            item=>

            item!==removed

          );



      }



      return copy;


    });



  }













  function validate(){



    if(!title.trim())

      return "Quiz title is required";







    if(

      questions.length!==questionCount

    )

      return "Create all questions";









    for(const q of questions){



      if(!q.question.trim())

        return "Question cannot be empty";








      if(

        q.type==="mcq"

        ||

        q.type==="multiple-answer"

      ){



        if(

          q.options.some(

            option=>

            !option.trim()

          )

        )

          return "All options should have values";



      }








      if(q.type==="mcq"){



        if(!q.correctAnswer)

          return "Select correct answer";


      }









      if(q.type==="multiple-answer"){



        if(

          !q.correctAnswers

          ||

          q.correctAnswers.length===0

        )

          return "Mark correct answers";


      }








      if(q.type==="order"){



        if(

          q.items?.some(

            item=>

            !item.trim()

          )

        )

          return "Fill all items";





        if(

          q.correctOrder?.some(

            item=>

            !item.trim()

          )

        )

          return "Fill correct order";


      }



    }






    return "";



  }













  async function submitQuiz(){



    const validation =

      validate();





    if(validation){



      setError(validation);


      return;


    }







    try{



      setSaving(true);





   const quizRef = await addDoc(

  collection(
    db,
    "quizzes"
  ),

  {

    title,

    type:quizType,

    authorId:user.uid,

    authorName,

    receiver:
      authorName==="eraya"
      ?
      "icarus"
      :
      "eraya",


    reward:Number(reward),

    totalQuestions:questionCount,

    questions,

    attemptedBy:[],

    completedBy:[],

    createdAt:
      serverTimestamp()

  }

);
await addDoc(

  collection(

    db,

    "notifications"

  ),

  {

    receiver:

      authorName==="eraya"

      ?

      "icarus"

      :

      "eraya",



    type:"quiz",



    title:"New Quiz ✨",



    message:

      `${authorName} created a quiz for you`,



    metadata:{


      quizId:

        quizRef.id


    },



    read:false,



    createdAt:

      serverTimestamp()


  }

);





      navigate("/quiz");



    }

    catch(error){



      console.error(

        "Quiz creation error",

        error

      );



      setError(

        "Unable to create quiz"

      );



    }

    finally{


      setSaving(false);


    }



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
      <BackButton path="/quiz" label="Quiz Galaxy" />

      <div

        className="
          mx-auto
          max-w-5xl          
          
        "

      >

        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1
              className="
                text-3xl
                font-light
                tracking-[0.3em]
                sm:text-4xl
              "
            >
              CREATE QUIZ
            </h1>
            <div className="text-4xl sm:text-5xl">✦</div>
          </div>

          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">
            SHAPE A NEW CONSTELLATION FOR YOUR QUIZ GALAXY
          </p>
        </div>









        {/* QUIZ DETAILS */}



        <div

          className="
            mt-12
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-6 md:p-10
          "

        >



          <input

            value={title}

            onChange={e=>

              setTitle(e.target.value)

            }

            placeholder="Quiz title"

            className="
              w-full
              rounded-xl
              bg-black/40
              p-4
            "

          />







          <select

            value={quizType}

            onChange={e=>

              setQuizType(e.target.value)

            }

            className="
              mt-5
              w-full
              rounded-xl
              bg-black/40
              p-4
            "

          >

            <option value="normal">

              Normal

            </option>


            <option value="romance">

              Romance

            </option>


            <option value="dark-romance">

              Dark Romance

            </option>


          </select>








          <input

            type="number"

            value={reward}

            onChange={e=>

              setReward(

                Number(e.target.value)

              )

            }

            placeholder="Star Dust Reward"

            className="
              mt-5
              w-full
              rounded-xl
              bg-black/40
              p-4
            "

          />








          <select

            value={questionCount}

            onChange={e=>{


              setQuestionCount(

                Number(e.target.value)

              );


              setQuestions([]);



            }}

            className="
              mt-5
              w-full
              rounded-xl
              bg-black/40
              p-4
            "

          >


            {
              [5,6,7,8,9,10]

              .map(number=>(


                <option

                  key={number}

                  value={number}

                >

                  {number} Questions

                </option>


              ))

            }


          </select>








<button

onClick={initializeQuestions}

className="
mt-6
w-fit
cursor-pointer
rounded-full
border
border-purple-300/30
bg-purple-500/10
px-8
py-3
text-sm
tracking-widest
transition
hover:bg-purple-500/20
"

>
START BUILDING

</button>



        </div>









        {
          questions.map((q,index)=>(


            <div

              key={index}

              className="
                mt-8
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-8
              "

            >



              <h2>

                Question {index+1}

              </h2>









    <select

value={q.type}

onChange={e=>

changeQuestionType(

index,

e.target.value as QuestionType

)

}

className="
mt-5
w-full
cursor-pointer
rounded-xl
border
border-white/10
bg-black
p-3
text-white
outline-none
"

>


<option

value="mcq"

className="bg-black text-white"

>

Multiple Choice

</option>






</select>









              <input

                value={q.question}

                onChange={e=>

                  updateQuestion(

                    index,

                    {

                      question:e.target.value

                    }

                  )

                }

                placeholder="Question"

                className="
                  mt-5
                  w-full
                  rounded-xl
                  bg-black/40
                  p-3
                "

              />









              {
                q.type !== "order" && (


                <div className="mt-6">


                  <p className="
                    text-xs
                    tracking-[0.3em]
                    text-purple-300
                  ">

                    OPTIONS

                  </p>






                  {
                    q.options.map(

                      (option,i)=>(


                        <div

                          key={i}

                          className="
                            mt-4
                            flex
                            gap-3
                            items-center
                          "

                        >



                          <input

                            value={option}

                            onChange={e=>

                              updateOption(

                                index,

                                i,

                                e.target.value

                              )

                            }

                            placeholder={`Option ${i+1}`}

                            className="
                              flex-1
                              rounded-xl
                              bg-black/40
                              p-3
                            "

                          />








{
q.type==="multiple-answer" && (

<div className="mt-6">


<p className="
text-xs
tracking-[0.3em]
text-purple-300
">

MARK CORRECT ANSWERS

</p>



{
q.options.map(

(option,i)=>{


const isCorrect =

q.correctAnswers

?.includes(

option.trim()

);



return (

<div

key={i}

className="
mt-4
flex
items-center
gap-3
"

>


<input

value={option}

readOnly

className="
flex-1
rounded-xl
bg-black/40
p-3
"

/>





<button

type="button"

onClick={()=>{


toggleCorrectAnswer(

index,

option

);


}}

className={`

cursor-pointer

rounded-full

px-5

py-2

text-xs

transition


${

isCorrect

?

"bg-green-400 text-black"

:

"bg-white/10 text-white"

}

`}

>


{

isCorrect

?

"✓ Answer"

:

"Mark Answer"

}


</button>



</div>


);


}

)

}



</div>

)

}





                        </div>


                      )

                    )

                  }






                  <button

                    onClick={()=>addOption(index)}

                    className="
                      mt-4
                      cursor-pointer
                      text-purple-300
                    "

                  >

                    + ADD OPTION

                  </button>




                </div>


                )

              }









              {
                q.type==="mcq" && (


                <select

                  value={q.correctAnswer}

                  onChange={e=>

                    updateQuestion(

                      index,

                      {

                        correctAnswer:

                        e.target.value

                      }

                    )

                  }

                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-black/40
                    p-3
                  "

                >


                  <option value="">

                    Select correct answer

                  </option>




                  {
                    q.options.map(

                      (option,i)=>(


                        <option

                          key={i}

                          value={option}

                        >

                          {
                            option ||

                            `Option ${i+1}`

                          }

                        </option>


                      )

                    )

                  }


                </select>


                )

              }









              {
                q.type==="order" && (


                <div className="mt-8">


                  <p className="
                    text-xs
                    tracking-[0.3em]
                    text-purple-300
                  ">

                    ITEMS

                  </p>







                  {
                    q.items?.map(

                      (item,i)=>(


                        <input

                          key={i}

                          value={item}

                          onChange={e=>

                            updateOrderItem(

                              index,

                              i,

                              e.target.value

                            )

                          }

                          placeholder={`Item ${i+1}`}

                          className="
                            mt-3
                            w-full
                            rounded-xl
                            bg-black/40
                            p-3
                          "

                        />


                      )

                    )

                  }








                  <p className="
                    mt-8
                    text-xs
                    tracking-[0.3em]
                    text-purple-300
                  ">

                    SELECT CORRECT ORDER

                  </p>







                  {
                    q.correctOrder?.map(

                      (item,i)=>(


                        <div

                          key={i}

                          className="
                            mt-3
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-black/40
                            p-4
                          "

                        >



                          <span>

                            {i+1}

                          </span>





                          <input

                            value={item}

                            onChange={e=>

                              updateCorrectOrder(

                                index,

                                i,

                                e.target.value

                              )

                            }

                            placeholder={`Order ${i+1}`}

                            className="
                              flex-1
                              bg-transparent
                              outline-none
                            "

                          />






                          <button

                            onClick={()=>


                              moveCorrectOrderItem(

                                index,

                                i,

                                -1

                              )


                            }

                            className="
                              cursor-pointer
                            "

                          >

                            ↑

                          </button>







                          <button

                            onClick={()=>


                              moveCorrectOrderItem(

                                index,

                                i,

                                1

                              )


                            }

                            className="
                              cursor-pointer
                            "

                          >

                            ↓

                          </button>



                        </div>


                      )

                    )

                  }





                </div>


                )

              }





            </div>


          ))

        }









        {
          error && (


            <p className="
              mt-6
              text-center
              text-red-300
            ">

              {error}

            </p>


          )

        }









  <div className="
mt-10
flex
justify-center
">


<button

onClick={submitQuiz}

disabled={saving}

className="
cursor-pointer
rounded-full
border
border-green-300/30
bg-green-500/10
px-10
py-3
text-sm
tracking-widest
transition
hover:bg-green-500/20
"

>

{

saving

?

"CREATING..."

:

"CREATE QUIZ ✨"

}

</button>


</div>





      </div>


    </div>


  );


}



export default CreateQuizPage;
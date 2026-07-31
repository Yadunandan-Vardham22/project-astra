import {
  useEffect,
  useState
} from "react";


import {
  useSearchParams
} from "react-router-dom";

import FloatingLeavesBackground from "../components/FloatingLeavesBackground";
import GardenEntryModal from "../components/GardenEntryModal";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";


import {
  auth,
  db
} from "../firebase/firebaseConfig";






function GardenPage(){



  const [searchParams] = useSearchParams();


  const selectedEntry =

    searchParams.get("entryId");




  const [user,setUser] =

    useState<any>(null);



  const [starName,setStarName] =

    useState("");



  const [entries,setEntries] =

    useState<any[]>([]);




  const [modalType,setModalType] =

    useState<

      "bug" | "suggestion" | null

    >(null);




  const [submitted,setSubmitted] =

    useState(false);




  const [submittedMessage,setSubmittedMessage] =

    useState("");









  useEffect(()=>{


    const unsubscribeAuth =

      onAuthStateChanged(

        auth,

        async(currentUser)=>{


          if(!currentUser)

            return;



          setUser(currentUser);





          const userSnapshot =

            await getDoc(

              doc(

                db,

                "users",

                currentUser.uid

              )

            );





          if(userSnapshot.exists()){


            setStarName(

              userSnapshot.data().starName || ""

            );


          }



        }

      );





    return ()=>unsubscribeAuth();



  },[]);












  useEffect(()=>{


    const q = query(

      collection(

        db,

        "gardenEntries"

      ),

      orderBy(

        "createdAt",

        "desc"

      )

    );




    const unsubscribe =

      onSnapshot(

        q,

        snapshot=>{


          setEntries(

            snapshot.docs.map(doc=>({

              id:doc.id,

              ...doc.data()

            }))

          );


        }

      );




    return ()=>unsubscribe();



  },[]);












  // Garden entry submission is handled through GardenEntryModal.

  const isIcarus =

    starName.toLowerCase()

    ===

    "icarus";
  const isEraya =

    starName.toLowerCase()

    ===

    "eraya";

  function handleModalSubmitted(type: "bug" | "suggestion") {
    setModalType(null);
    setSubmitted(true);
    setSubmittedMessage(
      type === "bug"
        ? "Bug report submitted successfully."
        : "Suggestion submitted successfully."
    );
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
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

      <FloatingLeavesBackground />

      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-3xl font-light tracking-[0.3em]">Garden</h1>
          <div className="text-4xl">🌱</div>
        </div>

        <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">A place where Astra grows. Report bugs and plant ideas to make the universe better.</p>
      </div>



      <div

        className="
          mx-auto
          max-w-5xl
        "

      >




        <div className="
          text-center hidden
        ">



          <div className="text-6xl">

            🌱

          </div>




          <h1 className="
            mt-6
            text-5xl
            font-light
          ">

            Garden

          </h1>




          <p className="
            mt-5
            text-white/60
          ">

            A place where Astra grows.

            Report bugs and plant ideas
            to make the universe better.

          </p>



        </div>









        {
          submitted && (


            <div className="
              mt-8
              rounded-xl
              bg-green-500/10
              p-5
              text-center
            ">

              {submittedMessage}

            </div>


          )

        }









        {
          isEraya && !modalType && (


            <div className="
              mt-12
              grid
              gap-8
              md:grid-cols-2
            ">


              <button

                onClick={()=>setModalType("bug")}

                className="
                  cursor-pointer
                  rounded-3xl
                  border
                  border-red-300/20
                  bg-white/5
                  p-6 md:p-10
                "

              >

                🐛

                <h2 className="
                  mt-4
                  text-2xl
                ">

                  Report Bug

                </h2>


              </button>





              <button

                onClick={()=>setModalType("suggestion")}

                className="
                  cursor-pointer
                  rounded-3xl
                  border
                  border-green-300/20
                  bg-white/5
                  p-6 md:p-10
                "

              >

                🌱

                <h2 className="
                  mt-4
                  text-2xl
                ">

                  Suggest Feature

                </h2>


              </button>



            </div>


          )

        }

        {
          modalType && (
            <GardenEntryModal
              type={modalType}
              onClose={() => setModalType(null)}
              onSubmitted={() => handleModalSubmitted(modalType!)}
            />
          )
        }









        {
          isIcarus && (


            <div className="
              mt-12
            ">




              <h2 className="
                text-3xl
              ">

                🐛 Bug Reports

              </h2>




              {
                entries

                .filter(

                  item=>

                  item.type==="bug"

                )

                .map(entry=>(


                  <div

                    key={entry.id}

                    className={`

                      mt-5
                      rounded-2xl
                      p-5


                      ${
                        selectedEntry===entry.id

                        ?

                        "border border-green-400 bg-green-500/10"

                        :

                        "bg-white/5"

                      }

                    `}

                  >


                    <h3 className="text-xl">

                      {entry.title}

                    </h3>


                    <p className="
                      mt-3
                      text-white/60
                    ">

                      {entry.description}

                    </p>


                    <p className="
                      mt-3
                      text-xs
                      text-purple-300
                    ">

                      Reported by {entry.createdBy}

                    </p>


                  </div>


                ))

              }









              <h2 className="
                mt-12
                text-3xl
              ">

                🌱 Feature Suggestions

              </h2>




              {
                entries

                .filter(

                  item=>

                  item.type==="suggestion"

                )

                .map(entry=>(


                  <div

                    key={entry.id}

                    className={`

                      mt-5
                      rounded-2xl
                      p-5


                      ${
                        selectedEntry===entry.id

                        ?

                        "border border-green-400 bg-green-500/10"

                        :

                        "bg-white/5"

                      }

                    `}

                  >


                    <h3 className="text-xl">

                      {entry.title}

                    </h3>


                    <p className="
                      mt-3
                      text-white/60
                    ">

                      {entry.description}

                    </p>


                    <p className="
                      mt-3
                      text-xs
                      text-purple-300
                    ">

                      Suggested by {entry.createdBy}

                    </p>


                  </div>


                ))

              }



            </div>


          )

        }





      </div>


    </div>


  );

}



export default GardenPage;
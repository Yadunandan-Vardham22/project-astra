import {
  useEffect,
  useState
} from "react";


import {
  useSearchParams
} from "react-router-dom";


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




  const [mode,setMode] =

    useState<

      "bug" | "suggestion" | null

    >(null);




  const [title,setTitle] =

    useState("");




  const [description,setDescription] =

    useState("");




  const [saving,setSaving] =

    useState(false);




  const [submitted,setSubmitted] =

    useState(false);









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












  async function submitEntry(){



    if(

      !title.trim()

      ||

      !description.trim()

      ||

      !user

      ||

      !mode

    )

      return;






    try{



      setSaving(true);






      const gardenRef =

        await addDoc(



          collection(

            db,

            "gardenEntries"

          ),



          {


            type:mode,



            title:title.trim(),




            description:

              description.trim(),




            createdBy:

              starName,




            createdByUid:

              user.uid,




            status:

              mode==="bug"

              ?

              "open"

              :

              "considering",




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


          receiver:"icarus",



          type:"garden",



          title:

            mode==="bug"

            ?

            "🐛 New Bug Report"

            :

            "🌱 New Feature Idea",




          message:

            `${starName} planted a new ${mode}`,




          metadata:{


            gardenId:

              gardenRef.id


          },




          read:false,




          createdAt:

            serverTimestamp()



        }



      );








      setTitle("");

      setDescription("");

      setMode(null);

      setSubmitted(true);






      setTimeout(()=>{


        setSubmitted(false);


      },3000);



    }

    catch(error){


      console.error(

        "Garden submit error",

        error

      );


    }

    finally{


      setSaving(false);


    }


  }









  const isIcarus =

    starName.toLowerCase()

    ===

    "icarus";









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



      <div

        className="
          mx-auto
          max-w-5xl
        "

      >




        <div className="
          text-center
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

              🌱 Seed planted successfully

            </div>


          )

        }









        {
          !isIcarus && !mode && (


            <div className="
              mt-12
              grid
              gap-8
              md:grid-cols-2
            ">


              <button

                onClick={()=>setMode("bug")}

                className="
                  cursor-pointer
                  rounded-3xl
                  border
                  border-red-300/20
                  bg-white/5
                  p-10
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

                onClick={()=>setMode("suggestion")}

                className="
                  cursor-pointer
                  rounded-3xl
                  border
                  border-green-300/20
                  bg-white/5
                  p-10
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
          mode && (


            <div className="
              mt-12
              rounded-3xl
              bg-white/5
              p-8
            ">



              <input

                value={title}

                onChange={e=>

                  setTitle(e.target.value)

                }

                placeholder="Title"

                className="
                  w-full
                  rounded-xl
                  bg-black/40
                  p-4
                "

              />




              <textarea

                value={description}

                onChange={e=>

                  setDescription(e.target.value)

                }

                placeholder="Description"

                className="
                  mt-5
                  w-full
                  rounded-xl
                  bg-black/40
                  p-4
                "

                rows={5}

              />




              <button

                onClick={submitEntry}

                disabled={saving}

                className="
                  mt-5
                  cursor-pointer
                  rounded-full
                  bg-green-400
                  px-8
                  py-3
                  text-black
                "

              >

                Submit

              </button>


            </div>


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
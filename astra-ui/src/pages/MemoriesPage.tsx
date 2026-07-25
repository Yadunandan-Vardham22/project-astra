import {
  useEffect,
  useState
} from "react";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore";


import {
  auth,
  db
} from "../firebase/firebaseConfig";











function MemoriesPage(){



  const [stardust,setStardust] =

    useState(0);



  const [unlocked,setUnlocked] =

    useState(false);



  const [userId,setUserId] =

    useState("");



  const [loading,setLoading] =

    useState(true);







  useEffect(()=>{



    const unsubscribeAuth =

      onAuthStateChanged(

        auth,

        user=>{



          if(!user)

            return;




          setUserId(user.uid);





          const userRef =

            doc(

              db,

              "users",

              user.uid

            );





          const unsubscribeUser =

            onSnapshot(

              userRef,

              snapshot=>{


                if(snapshot.exists()){


                  const data =

                    snapshot.data();





                  setStardust(

                    data.stardust || 0

                  );





                  setUnlocked(

                    data.memoriesUnlocked || false

                  );


                }



                setLoading(false);



              }

            );





          return unsubscribeUser;



        }

      );





    return ()=>unsubscribeAuth();



  },[]);











  async function unlockMemories(){



    if(

      stardust < 5000

      ||

      !userId

    )

      return;







    await updateDoc(



      doc(

        db,

        "users",

        userId

      ),



      {


        memoriesUnlocked:true


      }



    );



  }









  if(loading){


    return (

      <div className="
        h-screen
        w-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Loading memories...

      </div>

    );


  }









  return (


    <div

      className="
        relative
        h-screen
        w-screen
        overflow-hidden
        bg-black
        text-white
      "

    >





  









      <div

        className="
          flex
          h-full
          items-center
          justify-center
        "

      >





        <div

          className="
            max-w-xl
            rounded-3xl
            border
            border-white/10
            bg-white/5
            p-10
            text-center
            backdrop-blur-xl
          "

        >





          <div className="text-6xl">

            🌌

          </div>








          <h1

            className="
              mt-6
              text-4xl
              font-light
            "

          >

            Memories Orb

          </h1>








          <p

            className="
              mt-6
              text-white/70
            "

          >

            A private constellation where
            your favourite photographs,
            beautiful days and unforgettable
            moments will live forever.

          </p>









          {

            !unlocked && (


              <>


                <div

                  className="
                    mt-8
                    rounded-2xl
                    border
                    border-purple-300/20
                    bg-purple-500/10
                    p-6
                  "

                >



                  <p className="
                    text-sm
                    text-purple-300
                  ">

                    PREMIUM FEATURE

                  </p>






                  <p className="
                    mt-4
                    text-2xl
                  ">

                    🔒 Locked

                  </p>






                  <p className="
                    mt-4
                    text-sm
                    text-white/60
                  ">

                    Unlock this realm with

                  </p>






                  <p className="
                    mt-2
                    text-xl
                  ">

                    ✨ 5000 Stardust

                  </p>





                  <p className="
                    mt-6
                    text-sm
                  ">

                    Your Stardust

                  </p>






                  <p className="
                    text-lg
                  "

                  >

                    {stardust} / 5000

                  </p>









                  <button


                    disabled={

                      stardust < 5000

                    }


                    onClick={unlockMemories}



                    className={`

                      mt-6

                      rounded-full

                      px-8

                      py-3

                      cursor-pointer

                      transition


                      ${

                        stardust >= 5000

                        ?

                        "bg-purple-400 text-black"

                        :

                        "cursor-not-allowed bg-white/10 text-white/40"

                      }

                    `}


                  >

                    Unlock Memories ✨

                  </button>





                </div>


              </>


            )


          }








          {

            unlocked && (


              <div

                className="
                  mt-8
                  rounded-2xl
                  bg-green-500/10
                  p-6
                "

              >

                ✨ Memories Orb Unlocked

                <p className="
                  mt-3
                  text-sm
                  text-white/60
                ">

                  Your memories constellation is ready.

                </p>


              </div>


            )


          }





        </div>





      </div>





    </div>


  );


}



export default MemoriesPage;
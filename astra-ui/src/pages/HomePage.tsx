import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  doc,
  onSnapshot
} from "firebase/firestore";


import {
  auth,
  db
} from "../firebase/firebaseConfig";


import IcarusKissCounter from "../components/IcarusKissCounter";
import StardustCounter from "../components/StardustCounter";
import UniverseMap from "../components/UniverseMap";
import NotificationBell from "../components/NotificationBell";








function HomePage(){



  const navigate = useNavigate();



  const [stardust,setStardust] =
    useState(0);



  const [starName,setStarName] =
    useState("");



  const [kisses,setKisses] =
    useState(0);



  const [sweetKisses,setSweetKisses] =
    useState(0);



  const [lipLocks,setLipLocks] =
    useState(0);



  const [latestNote,setLatestNote] =
    useState("");









  useEffect(()=>{


    const unsubscribeAuth =

      onAuthStateChanged(

        auth,

        (user)=>{


          if(!user)
            return;





          const userRef =
            doc(

              db,

              "users",

              user.uid

            );





          const unsubscribeUser =

            onSnapshot(

              userRef,

              (snapshot)=>{


                if(snapshot.exists()){


                  const data =
                    snapshot.data();





                  setStarName(

                    data.starName || ""

                  );





                  setStardust(

                    data.stardust || 0

                  );





                  setKisses(

                    data.kissesReceived || 0

                  );





                  setSweetKisses(

                    data.sweetKissesReceived || 0

                  );





                  setLipLocks(

                    data.lipLocksReceived || 0

                  );





                  setLatestNote(

                    data.latestKissNote || ""

                  );



                }


              },

              (error)=>{


                console.error(

                  "Firestore listener error:",

                  error

                );


              }


            );





          return unsubscribeUser;


        }


      );





    return ()=>unsubscribeAuth();



  },[]);









  async function handleLogout(){


    try{


      await signOut(auth);


      navigate("/");


    }

    catch(error){


      console.error(

        "Logout failed:",

        error

      );


    }


  }









  return (


    <div

      className="
        relative
        h-screen
        w-screen
        overflow-hidden
        bg-black
      "

    >





      {/* Astra Universe */}


      <div

        className="
          relative
          z-10
          h-full
          w-full
        "

      >

        <UniverseMap />


      </div>









      {/* Stardust */}


      <div

        className="
          fixed
          top-8
          left-1/2
          z-50
          -translate-x-1/2
        "

      >


        <StardustCounter

          value={stardust}

        />


      </div>









      {/* Navigation */}


      <div

        className="
          fixed
          top-8
          right-8
          z-50
          flex
          items-center
          gap-4
          rounded-full
          border
          border-white/10
          bg-black/40
          px-4
          py-2
          backdrop-blur-xl
        "

      >





        <NotificationBell />







        <button

          onClick={handleLogout}

          className="
            cursor-pointer
            rounded-full
            border
            border-white/30
            bg-white/10
            px-5
            py-2
            text-xs
            tracking-widest
            text-white
            transition
            hover:bg-white/20
          "

        >

          LOGOUT


        </button>





      </div>









      {/* Icarus Receiver Counter Only */}


      {

        starName==="icarus" && (


          <IcarusKissCounter

            value={kisses}

            sweetKisses={sweetKisses}

            lipLocks={lipLocks}

            latestNote={latestNote}

          />


        )


      }







    </div>


  );

}



export default HomePage;
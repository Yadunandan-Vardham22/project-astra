import { 
  useEffect, 
  useState 
} from "react";
import { motion } from "framer-motion";

import { 
  useNavigate 
} from "react-router-dom";


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

                  "User listener error:",

                  error

                );


              }


            );









          const stardustRef =

            doc(

              db,

              "stardust",

              user.uid

            );









          const unsubscribeStardust =

            onSnapshot(



              stardustRef,



              (snapshot)=>{


                if(snapshot.exists()){


                  const data =

                    snapshot.data();



                  setStardust(

                    data.total || 0

                  );



                }

                else{


                  setStardust(0);


                }



              },



              (error)=>{


                console.error(

                  "Stardust listener error:",

                  error

                );


              }



            );









          return ()=>{


            unsubscribeUser();


            unsubscribeStardust();


          };



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







      <div


        className="
          relative
          z-10
          h-full
          w-full
        "


      >
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="
    absolute
    top-8
    left-1/2
    -translate-x-1/2
    z-30
    select-none
  "
>
  <h1
    className="
      flex
      items-center
      gap-2
      text-2xl
      md:text-4xl
      font-light
      tracking-wide
      text-white
    "
  >
    <motion.span
      animate={{
        opacity: [0.75, 1, 0.75],
        scale: [1, 1.15, 1],
        rotate: [0, 12, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ✨
    </motion.span>

    Astra
  </h1>
</motion.div>

        <UniverseMap />


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

    <StardustCounter
        value={stardust}
    />

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
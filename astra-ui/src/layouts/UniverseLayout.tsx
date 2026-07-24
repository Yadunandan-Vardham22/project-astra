import { Outlet, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  doc,
  onSnapshot
} from "firebase/firestore";


import {
  auth,
  db
} from "../firebase/firebaseConfig";


import GlobalKissCounter from "../components/GlobalKissCounter";
import HomeButton from "../components/HomeButton";








function UniverseLayout(){



  const location = useLocation();



  const [starName,setStarName] =
    useState("");









  useEffect(()=>{


    const unsubscribeAuth =

      onAuthStateChanged(

        auth,

        (user)=>{


          if(!user){

            setStarName("");

            return;

          }






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


                }


              },

              (error)=>{


                console.error(

                  "Universe user listener error:",

                  error

                );


              }


            );





          return unsubscribeUser;


        }


      );







    return ()=>unsubscribeAuth();



  },[]);












  return (

    <>


      {


location.pathname !== "/home" &&

!location.pathname.startsWith("/observatory/") &&

!location.pathname.startsWith("/letters/") && (


          <div

            className="
              fixed
              top-8
              left-8
              z-[100]
            "

          >

            <HomeButton />


          </div>


        )

      }









      <Outlet />









      {


        starName==="eraya" && (


          <GlobalKissCounter

            starName={starName}

          />


        )


      }





    </>

  );


}



export default UniverseLayout;
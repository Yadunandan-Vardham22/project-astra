import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  auth,
  db
} from "../firebase/firebaseConfig";









function NotificationBell(){



  const navigate = useNavigate();




  const [open,setOpen] =

    useState(false);




  const [notifications,setNotifications] =

    useState<any[]>([]);




  const [bellRef,setBellRef] =

    useState<HTMLDivElement|null>(null);









  useEffect(()=>{


    let unsubscribeNotifications:any;



    const unsubscribeAuth =

      onAuthStateChanged(

        auth,

        async(user)=>{


          if(!user)

            return;






          const userRef =

            doc(

              db,

              "users",

              user.uid

            );







          const userSnapshot =

            await getDoc(userRef);







          if(!userSnapshot.exists())

            return;







          const data =

            userSnapshot.data();







          const currentStarName =

            (

              data.starName || ""

            ).toLowerCase();







          if(!currentStarName)

            return;









          const notificationQuery =

            query(



              collection(

                db,

                "notifications"

              ),




              where(

                "receiver",

                "==",

                currentStarName

              ),




              orderBy(

                "createdAt",

                "desc"

              )


            );








          unsubscribeNotifications =

            onSnapshot(



              notificationQuery,



              (snapshot)=>{


                const data =

                  snapshot.docs.map(doc=>({


                    id:doc.id,


                    ...doc.data()


                  }));





                setNotifications(data);



              },



              (error)=>{


                console.error(

                  "Notification listener error:",

                  error

                );


              }



            );




        }


      );









    return ()=>{


      unsubscribeAuth();



      if(unsubscribeNotifications)

        unsubscribeNotifications();



    };



  },[]);














  useEffect(()=>{


    function handleOutsideClick(

      event:MouseEvent

    ){


      if(

        bellRef &&

        !bellRef.contains(

          event.target as Node

        )

      ){


        setOpen(false);


      }



    }






    document.addEventListener(

      "mousedown",

      handleOutsideClick

    );







    return ()=>{


      document.removeEventListener(

        "mousedown",

        handleOutsideClick

      );



    };



  },[bellRef]);














  async function markNotificationsRead(){



    const unread =

      notifications.filter(

        notification =>

          notification.read===false

      );






    for(const notification of unread){



      await updateDoc(



        doc(

          db,

          "notifications",

          notification.id

        ),



        {

          read:true

        }



      );



    }



  }













  function openNotifications(){


    setOpen(true);


    markNotificationsRead();



  }












  const unreadCount =

    notifications.filter(

      notification =>

        notification.read===false

    ).length;














 function handleNotificationClick(
  notification: any
) {

  if (
    notification.type === "observatory" &&
    notification.metadata?.storyId
  ) {

    navigate(
      `/observatory/${notification.metadata.storyId}`
    );

    setOpen(false);
    return;
  }

  if (
    notification.type === "letter" &&
    notification.metadata?.letterId
  ) {

    navigate(
      `/letters/${notification.metadata.category}/${notification.metadata.letterId}`
    );

    setOpen(false);
    return;
  }

  if (
    notification.type === "bucket" &&
    notification.metadata?.bucketId
  ) {

    navigate(
      `/bucket-list/${notification.metadata.bucketId}`
    );

    setOpen(false);
    return;
  }

  if (
    notification.type === "quiz" &&
    notification.metadata?.quizId
  ) {

    navigate(
      `/quiz/${notification.metadata.quizId}`
    );

    setOpen(false);
    return;
  }

  if (
    notification.type === "garden"
  ) {

    navigate(
      `/garden?entryId=${notification.metadata.gardenId}`
    );

    setOpen(false);
    return;
  }

  if (
    notification.type === "futureDream" &&
    notification.metadata?.dreamId
  ) {

    navigate("/romance/future-dreams");

    setOpen(false);
    return;
  }

  if (
    notification.type === "midnight"
  ) {

    navigate("/romance/late-night");

    setOpen(false);
    return;
  }

}













  return (


    <div


      ref={setBellRef}


      className="relative"


    >







      <button



        onClick={()=>{


          if(open)

            setOpen(false);


          else

            openNotifications();


        }}



        className="
          relative
          cursor-pointer
          text-xl
          transition
          hover:scale-110
        "


      >



        🔔






        {

          unreadCount>0 && (


            <span


              className="
                absolute
                -right-2
                -top-2
                rounded-full
                bg-red-500
                px-2
                text-xs
                text-white
              "


            >

              {unreadCount}


            </span>


          )

        }





      </button>









      <AnimatePresence>



      {

        open && (



          <motion.div



            initial={{

              opacity:0,

              y:-10

            }}



            animate={{

              opacity:1,

              y:0

            }}



            exit={{

              opacity:0,

              y:-10

            }}



            className="
              absolute
              right-0
              mt-4
              z-[200]
              w-72
              rounded-3xl
              border
              border-white/20
              bg-black/80
              p-5
              text-white
              backdrop-blur-xl
            "


          >






            <h2 className="
              mb-5
              text-sm
              tracking-widest
            ">

              NOTIFICATIONS

            </h2>









            {

              notifications.length===0

              ?



              <p className="
                text-sm
                text-white/50
              ">

                No notifications

              </p>



              :



              <div className="space-y-4">





              {

                notifications.map(notification=>(



                  <div



                    key={notification.id}



                    onClick={()=>handleNotificationClick(notification)}



                    className="
                      cursor-pointer
                      rounded-xl
                      border
                      border-white/10
                      p-3
                      transition
                      hover:bg-white/10
                    "


                  >





                    <p className="text-sm">


                      {notification.title}


                    </p>







                    <p className="
                      mt-2
                      text-xs
                      text-white/60
                    ">


                      {notification.message}


                    </p>






                  </div>



                ))



              }





              </div>


            }







          </motion.div>


        )

      }



      </AnimatePresence>






    </div>


  );

}





export default NotificationBell;
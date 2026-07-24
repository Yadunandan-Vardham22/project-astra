import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";

import {
  db,
  auth
} from "../firebase/firebaseConfig";

import {
  onAuthStateChanged
} from "firebase/auth";

import type {
  User
} from "firebase/auth";

import BackButton from "../components/BackButton";
import EditStoryModal from "../components/EditStoryModal";





const chapters = [

  {
    id:"icarus-falls",
    title:"Icarus Falls"
  },

  {
    id:"eraya",
    title:"Eraya"
  },

  {
    id:"little-constellations",
    title:"Little Constellations"
  }

];







function ChapterPage(){


  const {chapter}=useParams();


  const navigate = useNavigate();



  const [story,setStory]=useState<any>(null);

  const [loading,setLoading]=useState(true);

  const [currentUser,setCurrentUser]=useState<User|null>(null);

  const [editOpen,setEditOpen]=useState(false);









  async function fetchStory(){


    if(!chapter)
      return;



    try{


      const storyRef = doc(

        db,

        "stories",

        chapter

      );



      const snapshot = await getDoc(

        storyRef

      );



      if(snapshot.exists()){


        setStory({

          id:snapshot.id,

          ...snapshot.data()

        });


      }



    }

    catch(error){


      console.error(
        "Error fetching story:",
        error
      );


    }

    finally{


      setLoading(false);


    }


  }









  useEffect(()=>{


    fetchStory();



  },[chapter]);









  useEffect(()=>{


    const unsubscribe = onAuthStateChanged(

      auth,

      (user)=>{


        setCurrentUser(user);


      }

    );



    return ()=>unsubscribe();



  },[]);


useEffect(()=>{


  async function markChapterNotificationRead(){


    if(!chapter || !currentUser)
      return;



    const userRef = doc(

      db,

      "users",

      currentUser.uid

    );



    const userSnapshot =

      await getDoc(userRef);



    if(!userSnapshot.exists())
      return;



    const userData =
      userSnapshot.data();



    const currentStarName =

      (
        userData.starName || ""
      ).toLowerCase();



    if(!currentStarName)
      return;





    const notificationQuery = query(

      collection(

        db,

        "notifications"

      ),



      where(

        "receiver",

        "==",

        currentStarName

      ),



      where(

        "type",

        "==",

        "observatory"

      )

    );





    const snapshot =

      await getDocs(

        notificationQuery

      );





    snapshot.docs.forEach(

      async(notificationDoc)=>{


        const data =
          notificationDoc.data();



        if(

          data.metadata?.storyId === chapter &&

          data.read === false

        ){


          await updateDoc(

            doc(

              db,

              "notifications",

              notificationDoc.id

            ),

            {

              read:true

            }

          );


        }


      }

    );


  }





  markChapterNotificationRead();



},[chapter,currentUser]);






  if(loading){


    return (

      <div

        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
        "

      >

        Discovering chapter...

      </div>

    );

  }








  if(!story){


    return (

      <div

        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
        "

      >

        Story not found

      </div>

    );

  }









  const canEdit =

    currentUser?.uid === story.authorId;







  const currentIndex =

    chapters.findIndex(

      item => item.id === story.id

    );



  const previousChapter =

    chapters[currentIndex - 1];



  const nextChapter =

    chapters[currentIndex + 1];









  return (

    <div


      className="
        relative
        min-h-screen
        w-screen
        overflow-hidden
        bg-black
        px-8
        py-20
        text-white
      "


    >







      {
        story.backgroundImage && (


          <motion.img


            initial={{

              scale:1.05

            }}



            animate={{

              scale:1

            }}



            transition={{

              duration:10

            }}



            src={story.backgroundImage}



            alt={story.title}



            className="
              fixed
              inset-0
              h-screen
              w-screen
              object-cover
              opacity-40
            "


          />

        )
      }









      <div

        className="
          fixed
          inset-0
          bg-black/60
        "

      />









      <BackButton

        path="/observatory"

        label="Observatory"

      />









      <div


        className="
          relative
          z-10
          mx-auto
          max-w-3xl
        "


      >







        <div

          className="
            text-center
          "

        >







          <motion.div


            animate={{

              rotate:360

            }}



            transition={{

              duration:20,

              repeat:Infinity,

              ease:"linear"

            }}



            className="
              text-6xl
            "

          >

            🔭

          </motion.div>









          <p

            className="
              mt-10
              text-xs
              tracking-[0.6em]
              text-purple-300
            "

          >

            CHAPTER

          </p>









          <h1

            className="
              mt-5
              text-5xl
              font-light
            "

          >

            {story.title}

          </h1>









          <p

            className="
              mt-5
              text-sm
              text-purple-200
            "

          >

            Written by:

            {" "}

            {story.author}

          </p>









          {
            canEdit && (

              <button


                onClick={()=>setEditOpen(true)}



                className="
                  mt-6
                  cursor-pointer
                  rounded-full
                  border
                  border-purple-300/30
                  bg-purple-500/10
                  px-8
                  py-3
                  text-xs
                  tracking-[0.4em]
                  transition
                  hover:bg-purple-500/20
                "

              >

                ✦ EDIT STORY

              </button>

            )
          }









          {
            story.quotes?.map(

              (quote:string,index:number)=>(


                <p


                  key={index}


                  className="
                    mt-8
                    text-xl
                    italic
                    text-purple-100
                  "

                >

                  "{quote}"

                </p>


              )

            )
          }






        </div>









        <motion.div


          initial={{

            opacity:0,

            y:40

          }}



          animate={{

            opacity:1,

            y:0

          }}



          transition={{

            duration:1

          }}



          className="
            mt-16
            rounded-3xl
            border
            border-white/10
            bg-white/[0.04]
            p-10
            backdrop-blur-xl
          "


        >





          <p


            className="
              whitespace-pre-line
              text-lg
              font-light
              leading-relaxed
              text-white/80
            "


          >

            {story.description}

          </p>





        </motion.div>









        <div

          className="
            mt-14
            flex
            justify-center
            gap-4
          "

        >





          {
            previousChapter && (

              <button


                onClick={()=>navigate(

                  `/observatory/${previousChapter.id}`

                )}



                className="
                  cursor-pointer
                  rounded-full
                  border
                  border-white/20
                  px-6
                  py-3
                  text-xs
                  tracking-widest
                "

              >

                ← {previousChapter.title}

              </button>

            )
          }








          {
            nextChapter && (

              <button


                onClick={()=>navigate(

                  `/observatory/${nextChapter.id}`

                )}



                className="
                  cursor-pointer
                  rounded-full
                  border
                  border-white/20
                  px-6
                  py-3
                  text-xs
                  tracking-widest
                "

              >

                {nextChapter.title} →

              </button>

            )
          }








          {
            !previousChapter &&
            !nextChapter && (

              <button


                onClick={()=>navigate("/observatory")}



                className="
                  cursor-pointer
                  rounded-full
                  border
                  border-white/20
                  px-6
                  py-3
                  text-xs
                  tracking-widest
                "

              >

                ← Observatory

              </button>

            )
          }





        </div>









      </div>








      {
        editOpen && (

          <EditStoryModal


            story={story}


            onClose={()=>setEditOpen(false)}



            onUpdated={()=>{


              fetchStory();


            }}


          />

        )
      }







    </div>

  );

}





export default ChapterPage;
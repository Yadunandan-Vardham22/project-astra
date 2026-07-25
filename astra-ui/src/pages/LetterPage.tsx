import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  db,
  auth
} from "../firebase/firebaseConfig";


import type {
  User
} from "firebase/auth";


import BackButton from "../components/BackButton";
import EditLetterModal from "../components/EditLetterModal";

const collectionInfo:any = {

  love:{
    icon:"💗"
  },

  angry:{
    icon:"🔥"
  },

  apologies:{
    icon:"🌧"
  },

  "dream-journal":{
    icon:"🌙"
  },

    confessions:{
    icon:"🤍"
  }

};





function LetterPage(){



  const {
    category,
    letterId
  } = useParams();


const collection =
  collectionInfo[category || "love"];

  const [letter,setLetter] =
    useState<any>(null);



  const [loading,setLoading] =
    useState(true);



  const [currentUser,setCurrentUser] =
    useState<User|null>(null);




  const [editOpen,setEditOpen] =
    useState(false);







  useEffect(()=>{


    const unsubscribe =

      onAuthStateChanged(

        auth,

        (user)=>{

          setCurrentUser(user);

        }

      );



    return ()=>unsubscribe();



  },[]);









  async function fetchLetter(){



    if(!letterId)

      return;



    try{


      const letterRef =

        doc(

          db,

          "letters",

          letterId

        );





      const snapshot =

        await getDoc(letterRef);





      if(snapshot.exists()){


        const data = snapshot.data();



        let updatedViewedBy =

          data.viewedBy || [];






        if(

          currentUser &&

          !updatedViewedBy.includes(

            currentUser.uid

          )

        ){



          await updateDoc(

            letterRef,

            {

              viewedBy:

                arrayUnion(

                  currentUser.uid

                )

            }

          );



          updatedViewedBy = [

            ...updatedViewedBy,

            currentUser.uid

          ];

        }







        setLetter({

          id:snapshot.id,

          ...data,

          viewedBy:updatedViewedBy

        });



      }



    }


    catch(error){


      console.error(

        "Error fetching letter:",

        error

      );


    }


    finally{


      setLoading(false);


    }



  }









  useEffect(()=>{


    if(currentUser){


      fetchLetter();


    }


  },[letterId,currentUser]);













  if(loading){


    return (

      <div

        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "

      >

        Discovering letter...

      </div>

    );


  }









  if(!letter){


    return (

      <div

        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
        "

      >

        Letter not found

      </div>

    );


  }









  const canEdit =

    currentUser?.uid === letter.authorId;













  return (



    <div


      className="
        min-h-screen
        w-screen
        bg-black
        px-8
        py-20
        text-white
      "


    >






      <BackButton

        path={`/letters/${category}`}

        label="Letters"

      />









      <div


        className="
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


            initial={{

              scale:0

            }}



            animate={{

              scale:1

            }}



            className="
              text-7xl
            "


          >

            {collection.icon}


          </motion.div>









          <h1


            className="
              mt-8
              text-5xl
              font-light
              italic
            "


          >

            {letter.title}


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

            {letter.authorName}


          </p>






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



          className="
            mt-16
            rounded-3xl
            border
            border-pink-200/30
            bg-[#faf5ed]
            p-10
            text-black
            shadow-2xl
          "


        >






          <p


            className="
              whitespace-pre-line
              font-serif
              text-lg
              leading-relaxed
            "


          >

            {letter.greeting || "Dear Star,"}


            {"\n\n"}


            {letter.content}


            {"\n\n"}


            {letter.signature || "With love."}



          </p>









          <div


            className="
              mt-10
              text-right
              text-3xl
            "


          >

            💋


          </div>





        </motion.div>









        {

          canEdit && (


            <button


              onClick={()=>setEditOpen(true)}



              className="
                mt-10
                w-full
                cursor-pointer
                rounded-full
                border
                border-white/20
                py-3
                text-xs
                tracking-[0.4em]
                transition
                hover:bg-white/10
              "


            >

              ✦ EDIT LETTER


            </button>


          )

        }









      </div>







      {editOpen && (
        <EditLetterModal
          letter={letter}
          onClose={() => setEditOpen(false)}
          onUpdated={() => {
            fetchLetter();
          }}
        />
      )}

    </div>


  );

}



export default LetterPage;
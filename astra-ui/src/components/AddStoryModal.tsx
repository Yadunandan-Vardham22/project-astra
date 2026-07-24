import { useEffect, useState } from "react";

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

import type {
  User
} from "firebase/auth";


import {
  db,
  auth
} from "../firebase/firebaseConfig";

import {
  createNotification
} from "../services/notificationService";



interface AddStoryModalProps {

  onClose:()=>void;

  onAdded:()=>void;

}







function AddStoryModal({

  onClose,

  onAdded

}:AddStoryModalProps){



  const [title,setTitle] = useState("");

  const [description,setDescription] = useState("");

  const [authorId,setAuthorId] = useState("");

  const [authorName,setAuthorName] = useState("");

  const [backgroundImage,setBackgroundImage] = useState("");

  const [quotes,setQuotes] = useState("");

  const [saving,setSaving] = useState(false);

  const [error,setError] = useState("");









  useEffect(()=>{


    const unsubscribe = onAuthStateChanged(

      auth,

      async (user:User|null)=>{


        if(user){


          setAuthorId(user.uid);



          const userRef = doc(

            db,

            "users",

            user.uid

          );



          const snapshot = await getDoc(

            userRef

          );



          if(snapshot.exists()){


            const data = snapshot.data();



            setAuthorName(

              data.starName ||

              data.name ||

              data.username ||

              data.displayName ||

              "Unknown"

            );


          }

          else{


            setAuthorName("Unknown");


          }


        }


      }

    );



    return ()=>unsubscribe();



  },[]);









  const formattedAuthor =

    authorName

    ?

    authorName.charAt(0).toUpperCase() +

    authorName.slice(1)

    :

    "Detecting...";









  async function saveStory(){



    setError("");





    if(!title || !description){


      setError(
        "Title and description are required."
      );


      return;


    }







    if(!authorId){


      setError(
        "User not detected."
      );


      return;


    }









    try{


      setSaving(true);





const storyRef = await addDoc(

  collection(db,"stories"),

  {

    title,

    description,

    author:authorName,

    authorId,

    backgroundImage,

    quotes:

      quotes

      .split("\n")

      .filter(

        q=>q.trim()!==""


      ),


    createdAt:

      serverTimestamp()

  }

);

await createNotification({

  receiver:

    authorName.toLowerCase()==="icarus"

    ?

    "eraya"

    :

    "icarus",



  sender:

    authorName.toLowerCase(),



  type:

    "observatory",



  title:

    "A new chapter was added 🔭",



  message:

    `${formattedAuthor} added a new chapter to the Observatory`,



  metadata:{

    storyId:
      storyRef.id,


    storyTitle:
      title

  }

});



      onAdded();

      onClose();



    }

    catch(error){


      console.error(

        "Error creating story:",

        error

      );


      setError(

        "Something went wrong."

      );


    }

    finally{


      setSaving(false);


    }



  }









  return (



    <div


      onClick={onClose}



      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/80
        backdrop-blur-md
        px-5
      "


    >







      <div


        onClick={(e)=>e.stopPropagation()}



        className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          border
          border-white/10
          bg-black/90
          p-10
          text-white
          scrollbar-hide
        "


      >






        <h2

          className="
            text-center
            text-3xl
            font-light
          "

        >

          Create Story ✦

        </h2>







        <p

          className="
            mt-6
            text-center
            text-sm
            text-purple-200
          "

        >

          Written by:

          {" "}

          <span className="text-white">

            {formattedAuthor}

          </span>


        </p>









        <input


          value={title}



          onChange={(e)=>

            setTitle(e.target.value)

          }



          placeholder="Story title"



          className="
            mt-8
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-4
            outline-none
          "


        />









        <textarea


          value={description}



          onChange={(e)=>

            setDescription(e.target.value)

          }



          placeholder="Write your story..."



          rows={6}



          className="
            mt-4
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-4
            outline-none
          "


        />







        <p

          className="
            mt-3
            text-xs
            leading-relaxed
            text-white/50
          "

        >

          ✦ Text inside quotation marks (" ")

          will automatically be highlighted.

          <br/>

          Example:

          "The stars remember everything."

        </p>









        <input


          value={backgroundImage}



          onChange={(e)=>

            setBackgroundImage(e.target.value)

          }



          placeholder="Background image URL"



          className="
            mt-6
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-4
            outline-none
          "


        />







        <p

          className="
            mt-3
            text-xs
            leading-relaxed
            text-white/50
          "

        >

          ✦ Background image:

          <br/>

          • Images are automatically adjusted

          to fit the chapter frame.

          <br/>

          • Landscape images are recommended.

          <br/>

          • Recommended size: 1920 × 1080.

        </p>









        <textarea


          value={quotes}



          onChange={(e)=>

            setQuotes(e.target.value)

          }



          placeholder="Optional quotes (one per line)"



          rows={3}



          className="
            mt-6
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-4
            outline-none
          "


        />









        {
          error && (

            <p

              className="
                mt-5
                text-center
                text-sm
                text-red-300
              "

            >

              {error}

            </p>

          )
        }









        <button



          disabled={saving}



          onClick={saveStory}



          className="
            mt-8
            w-full
            cursor-pointer
            rounded-full
            border
            border-purple-300/30
            bg-purple-500/10
            py-4
            text-xs
            tracking-[0.4em]
          "


        >

          {

            saving

            ?

            "CREATING..."

            :

            "SAVE STORY ✦"

          }


        </button>








      </div>







    </div>

  );

}



export default AddStoryModal;
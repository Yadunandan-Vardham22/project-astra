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
  auth,
  db
} from "../firebase/firebaseConfig";


import {
  createNotification
} from "../services/notificationService";




interface AddLetterModalProps {

  onClose:()=>void;

  onAdded:()=>void;

}







function AddLetterModal({

  onClose,

  onAdded

}:AddLetterModalProps){



  const [title,setTitle] =
    useState("");



  const [greeting,setGreeting] =
    useState("Dear Star,");



  const [content,setContent] =
    useState("");



  const [signature,setSignature] =
    useState("With love.");



  const [category,setCategory] =
    useState("love");



  const [authorId,setAuthorId] =
    useState("");



  const [authorName,setAuthorName] =
    useState("");



  const [saving,setSaving] =
    useState(false);



  const [error,setError] =
    useState("");









  useEffect(()=>{


    const unsubscribe =

      onAuthStateChanged(

        auth,

        async(user:User|null)=>{


          if(!user)

            return;



          setAuthorId(user.uid);




          const userRef =

            doc(

              db,

              "users",

              user.uid

            );




          const snapshot =

            await getDoc(userRef);




          if(snapshot.exists()){


            const data =

              snapshot.data();




            setAuthorName(

              (

                data.starName ||

                data.name ||

                "Unknown"

              ).toLowerCase()

            );


          }


        }


      );




    return ()=>unsubscribe();



  },[]);









  async function saveLetter(){


    setError("");



    if(!title || !content){


      setError(
        "Title and letter content are required."
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





      const letterRef =

        await addDoc(

          collection(

            db,

            "letters"

          ),

          {


            title,


            greeting,


            content,


            signature,


            category,


            authorId,


            authorName,


            author:authorName,



            // Used for NEW badge tracking

            viewedBy:[],



            createdAt:

              serverTimestamp()


          }


        );








      await createNotification({


        receiver:

          authorName==="icarus"

          ?

          "eraya"

          :

          "icarus",




        sender:

          authorName,




        type:

          "letter",




        title:

          "A new letter arrived 💌",




        message:

          `${authorName} wrote you a letter`,




        metadata:{


          letterId:

            letterRef.id,


          category


        }


      });







      onAdded();

      onClose();




    }


    catch(error){


      console.error(

        "Error creating letter:",

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
          max-w-xl
          max-h-[85vh]
          overflow-y-auto
          scrollbar-hide
          rounded-3xl
          border
          border-white/10
          bg-black/90
          p-10
          text-white
        "


      >





        <h2

          className="
            text-center
            text-3xl
            font-light
          "

        >

          Write Letter 💌

        </h2>









<select

  value={category}

  onChange={(e)=>
    setCategory(e.target.value)
  }

  className="
    mt-6
    w-full
    rounded-xl
    border
    border-white/10
    bg-black
    p-4
    text-white
    outline-none
  "

>

  <option value="love">

    💗 Love Letters

  </option>


  <option value="angry">

    🔥 Angry Letters

  </option>


  <option value="apologies">

    🌧 Apology Letters

  </option>


  <option value="dream-journal">

    🌙 Dream Journal

  </option>


</select>









<input


  value={title}


  onChange={(e)=>
    setTitle(e.target.value)
  }


  placeholder="Letter title"


  className="
    mt-5
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    p-4
    outline-none
  "


/>









<input


  value={greeting}


  maxLength={50}


  onChange={(e)=>
    setGreeting(e.target.value)
  }


  placeholder="Opening line"


  className="
    mt-5
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    p-4
    outline-none
  "


/>


<p className="mt-2 text-xs text-white/50">

  {greeting.length}/50 characters

</p>









<textarea


  value={content}


  onChange={(e)=>
    setContent(e.target.value)
  }


  placeholder="Write your letter..."


  rows={8}


  className="
    mt-5
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    p-4
    outline-none
  "


/>








<input


  value={signature}


  maxLength={50}


  onChange={(e)=>
    setSignature(e.target.value)
  }


  placeholder="Closing line"


  className="
    mt-5
    w-full
    rounded-xl
    border
    border-white/10
    bg-white/5
    p-4
    outline-none
  "


/>


<p className="mt-2 text-xs text-white/50">

  {signature.length}/50 characters

</p>









{
  error && (

    <p

      className="
        mt-4
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


  onClick={saveLetter}


  className="
    mt-8
    w-full
    cursor-pointer
    rounded-full
    border
    border-pink-300/30
    bg-pink-500/10
    py-4
    text-xs
    tracking-[0.4em]
  "


>

{

saving

?

"SENDING..."

:

"SEND LETTER 💌"

}


</button>







      </div>





    </div>


  );

}



export default AddLetterModal;
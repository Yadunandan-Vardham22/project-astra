import { useState } from "react";

import {
  doc,
  updateDoc
} from "firebase/firestore";

import {
  db
} from "../firebase/firebaseConfig";





interface EditLetterModalProps {

  letter:any;

  onClose:()=>void;

  onUpdated:()=>void;

}







function EditLetterModal({

  letter,

  onClose,

  onUpdated

}:EditLetterModalProps){



  const [title,setTitle] =

    useState(letter.title || "");



  const [greeting,setGreeting] =

    useState(
      letter.greeting || "Dear Star,"
    );



  const [content,setContent] =

    useState(letter.content || "");



  const [signature,setSignature] =

    useState(
      letter.signature || "With love."
    );




  const [saving,setSaving] =

    useState(false);



  const [error,setError] =

    useState("");










  async function updateLetter(){


    try{


      setSaving(true);

      setError("");




      await updateDoc(


        doc(

          db,

          "letters",

          letter.id

        ),


        {


          title,


          greeting,


          content,


          signature


        }


      );





      onUpdated();

      onClose();



    }


    catch(error){


      console.error(

        "Error updating letter:",

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
          bg-black
          p-6 md:p-10
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

          Edit Letter ✦

        </h2>









        <input


          value={title}


          onChange={(e)=>

            setTitle(e.target.value)

          }


          placeholder="Letter title"


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


        <p className="
          mt-2
          text-xs
          text-white/50
        ">

          {greeting.length}/50 characters

        </p>









        <textarea


          value={content}


          onChange={(e)=>

            setContent(e.target.value)

          }


          rows={10}


          placeholder="Letter content"


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


        <p className="
          mt-2
          text-xs
          text-white/50
        ">

          {signature.length}/50 characters

        </p>









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


          onClick={updateLetter}


          className="
            mt-8
            w-full
            cursor-pointer
            rounded-full
            border
            border-purple-300/30
            bg-purple-500/10
            py-3 md:py-4
            text-xs
            tracking-[0.4em]
          "


        >

          {

            saving

            ?

            "SAVING..."

            :

            "SAVE CHANGES ✦"

          }


        </button>








      </div>





    </div>


  );

}



export default EditLetterModal;
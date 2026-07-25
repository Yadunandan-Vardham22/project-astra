import { useState } from "react";

import {
  doc,
  updateDoc
} from "firebase/firestore";

import {
  db
} from "../firebase/firebaseConfig";





interface EditStoryModalProps {

  story:any;

  onClose:()=>void;

  onUpdated:()=>void;

}







function EditStoryModal({

  story,

  onClose,

  onUpdated

}:EditStoryModalProps){



  const [title,setTitle]=useState(
    story.title || ""
  );


  const [description,setDescription]=useState(
    story.description || ""
  );


  const [backgroundImage,setBackgroundImage]=useState(
    story.backgroundImage || ""
  );


  const [quotes,setQuotes]=useState(

    story.quotes
    ?
    story.quotes.join("\n")
    :
    ""

  );


  const [saving,setSaving]=useState(false);


  const [error,setError]=useState("");









  async function updateStory(){



    setError("");



    try{


      setSaving(true);





      const storyRef = doc(

        db,

        "stories",

        story.id

      );





      await updateDoc(

        storyRef,

        {


          title,


          description,


          backgroundImage,



          quotes:

            quotes

            .split("\n")

            .filter(

              (q: string) => q.trim() !== ""

            )

        }

      );





      onUpdated();

      onClose();



    }

    catch(error){


      console.error(
        error
      );


      setError(
        "Unable to update story."
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

          Edit Story ✦

        </h2>







        <input


          value={title}



          onChange={(e)=>
            setTitle(e.target.value)
          }



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



          rows={7}



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








        <input


          value={backgroundImage}



          onChange={(e)=>
            setBackgroundImage(e.target.value)
          }



          placeholder="Background image URL"



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









        <textarea


          value={quotes}



          onChange={(e)=>
            setQuotes(e.target.value)
          }



          rows={3}



          placeholder="Quotes"



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








        {
          error && (

            <p

              className="
                mt-4
                text-center
                text-red-300
              "

            >

              {error}

            </p>

          )
        }








        <button


          disabled={saving}



          onClick={updateStory}



          className="
          cursor-pointer
            mt-8
            w-full
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

            "UPDATING..."

            :

            "UPDATE STORY ✦"

          }


        </button>







      </div>





    </div>

  );

}



export default EditStoryModal;
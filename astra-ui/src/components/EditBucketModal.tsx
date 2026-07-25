import {
  useState
} from "react";


import {
  doc,
  updateDoc
} from "firebase/firestore";


import {
  db
} from "../firebase/firebaseConfig";







interface EditBucketModalProps {


  bucket:any;


  onClose:()=>void;


  onUpdated:()=>void;


}








function EditBucketModal({

  bucket,

  onClose,

  onUpdated

}:EditBucketModalProps){





  const [title,setTitle] =

    useState(bucket.title || "");



  const [shortDescription,setShortDescription] =

    useState(bucket.shortDescription || "");



  const [details,setDetails] =

    useState(bucket.details || "");




  const [saving,setSaving] =

    useState(false);



  const [error,setError] =

    useState("");









  async function updateBucket(){



    if(

      !title ||

      !shortDescription ||

      !details

    ){


      setError(

        "All fields are required."

      );


      return;


    }







    try{


      setSaving(true);



      await updateDoc(



        doc(

          db,

          "bucketLists",

          bucket.id

        ),



        {


          title,


          shortDescription,


          details



        }



      );




      onUpdated();


      onClose();



    }



    catch(error){



      console.error(

        "Error updating bucket:",

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
          rounded-3xl
          border
          border-white/10
          bg-black/90
          p-10
          text-white
        "


      >







        <h2 className="
          text-center
          text-3xl
          font-light
        ">

          Edit Bucket Wish 🌌

        </h2>









        <input


          value={title}



          onChange={(e)=>

            setTitle(e.target.value)

          }



          placeholder="Title"



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









        <input


          value={shortDescription}



          maxLength={120}



          onChange={(e)=>

            setShortDescription(

              e.target.value

            )

          }



          placeholder="Short description"



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


          value={details}



          onChange={(e)=>

            setDetails(

              e.target.value

            )

          }



          placeholder="Details"



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









        {

          error && (


            <p className="
              mt-4
              text-center
              text-sm
              text-red-300
            ">

              {error}

            </p>


          )

        }









        <button


          onClick={updateBucket}



          disabled={saving}



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

            "UPDATING..."

            :

            "SAVE CHANGES ✨"


          }



        </button>







      </div>







    </div>


  );

}




export default EditBucketModal;
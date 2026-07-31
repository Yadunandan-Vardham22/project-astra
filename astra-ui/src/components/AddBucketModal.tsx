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







interface AddBucketModalProps {


  onClose:()=>void;


  onAdded:()=>void;


}









function AddBucketModal({

  onClose,

  onAdded

}:AddBucketModalProps){





  const [title,setTitle] =

    useState("");



  const [shortDescription,setShortDescription] =

    useState("");



  const [details,setDetails] =

    useState("");




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












  async function saveBucket(){



    setError("");




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






    if(!authorId){


      setError(

        "User not detected."

      );


      return;


    }







    try{


      setSaving(true);







      const bucketRef =


        await addDoc(


          collection(

            db,

            "bucketLists"

          ),



          {



            title,



            shortDescription,



            details,



            authorId,



            authorName,



            completed:false,



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

          "bucket",





        title:

          "A new dream was added 🌌",





        message:

          `${authorName} added a new bucket wish`,





        metadata:{



          bucketId:

            bucketRef.id



        }



      });









      onAdded();


      onClose();




    }


    catch(error){



      console.error(

        "Error creating bucket:",

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

          Add Bucket Wish 🌌


        </h2>









        <input


          value={title}



          onChange={(e)=>

            setTitle(e.target.value)

          }



          placeholder="Bucket wish title"



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

            setShortDescription(e.target.value)

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







        <p className="
          mt-2
          text-xs
          text-white/50
        ">

          {shortDescription.length}/120

        </p>









        <textarea


          value={details}



          onChange={(e)=>

            setDetails(e.target.value)

          }



          placeholder="Describe this dream in detail..."



          rows={7}



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


          disabled={saving}



          onClick={saveBucket}



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

            "ADD DREAM 🌌"


          }



        </button>








      </div>





    </div>


  );

}





export default AddBucketModal;
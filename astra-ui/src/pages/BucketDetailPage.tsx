import {
  useParams
} from "react-router-dom";


import {
  useEffect,
  useState
} from "react";


import {
  motion
} from "framer-motion";


import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  auth,
  db
} from "../firebase/firebaseConfig";


import type {
  User
} from "firebase/auth";


import BackButton from "../components/BackButton";
import EditBucketModal from "../components/EditBucketModal";









function BucketDetailPage(){



  const {
    bucketId
  } = useParams();





  const [bucket,setBucket] =

    useState<any>(null);




  const [currentUser,setCurrentUser] =

    useState<User|null>(null);



  const [loading,setLoading] =

    useState(true);




  const [completed,setCompleted] =

    useState(false);




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









  async function fetchBucket(){



    if(!bucketId)

      return;



    try{



      const bucketRef =

        doc(

          db,

          "bucketLists",

          bucketId

        );






      const snapshot =

        await getDoc(bucketRef);







      if(snapshot.exists()){


        const data =

          snapshot.data();





        let viewedUsers =

          data.viewedBy || [];







        if(

          currentUser &&

          !viewedUsers.includes(

            currentUser.uid

          )

        ){



          await updateDoc(

            bucketRef,

            {

              viewedBy:

                arrayUnion(

                  currentUser.uid

                )

            }

          );





          viewedUsers = [

            ...viewedUsers,

            currentUser.uid

          ];



        }









        setBucket({


          id:snapshot.id,


          ...data,


          viewedBy:viewedUsers


        });





        setCompleted(

          data.completed || false

        );



      }




    }

    catch(error){



      console.error(

        "Error loading bucket:",

        error

      );



    }


    finally{


      setLoading(false);


    }



  }









  useEffect(()=>{


    if(currentUser){

      fetchBucket();

    }



  },[bucketId,currentUser]);














  async function toggleCompleted(){



    if(!bucketId)

      return;





    const newValue =

      !completed;







    await updateDoc(



      doc(

        db,

        "bucketLists",

        bucketId

      ),



      {

        completed:newValue

      }



    );




    setCompleted(newValue);



  }














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

        Discovering dream...

      </div>

    );


  }









  if(!bucket){


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

        Bucket wish not found

      </div>

    );


  }









  const isEraya =

    bucket.authorName
    ?.toLowerCase()
    .trim()==="eraya";







  const canEdit =

    currentUser?.uid === bucket.authorId;









  return (



    <div


      className="
        min-h-screen
        bg-black
        px-8
        py-20
        text-white
      "


    >






      <BackButton

        path="/bucket-list"

        label="Bucket List"

      />









      <div


        className="
          mx-auto
          max-w-3xl
        "


      >







        <motion.div


          initial={{

            opacity:0,

            y:30

          }}



          animate={{

            opacity:1,

            y:0

          }}



          className={`

            rounded-3xl
            border
            p-12


            ${
              isEraya

              ?

              "border-pink-300/40 bg-pink-500/5"

              :

              "border-blue-300/40 bg-blue-500/5"

            }

          `}


        >







          <div className="text-center">


            <div className="text-7xl">

              🌌

            </div>





            <h1 className="
              mt-8
              text-5xl
              font-light
            ">

              {bucket.title}

            </h1>







            <p className="
              mt-5
              text-sm
              text-white/60
            ">

              Created by {bucket.authorName}

            </p>






            <p className="
              mt-2
              text-xs
              text-white/40
            ">


              {

                bucket.createdAt &&

                bucket.createdAt
                .toDate()
                .toLocaleDateString()

              }


            </p>






          </div>









          <div className="
            mt-12
            rounded-3xl
            bg-white/[0.05]
            p-8
          ">


            <p className="
              text-lg
              leading-relaxed
              text-white/80
            ">


              {bucket.details}


            </p>



          </div>









          <button


            onClick={toggleCompleted}



            className="

              mt-10
              w-full
              cursor-pointer
              rounded-full
              border
              border-white/20
              py-3 md:py-4
              text-xs
              tracking-[0.4em]
              transition
              hover:bg-white/10

            "


          >



            {

              completed

              ?

              "✓ COMPLETED"

              :

              "○ MARK AS COMPLETED"


            }



          </button>









          {

            canEdit && (


              <button


                onClick={()=>setEditOpen(true)}



                className="
                  mt-5
                  w-full
                  cursor-pointer
                  rounded-full
                  border
                  border-white/20
                  py-3 md:py-4
                  text-xs
                  tracking-[0.4em]
                  transition
                  hover:bg-white/10
                "


              >

                ✦ EDIT BUCKET WISH


              </button>


            )


          }







        </motion.div>







      </div>








      {

        editOpen && (


          <EditBucketModal


            bucket={bucket}



            onClose={()=>setEditOpen(false)}



            onUpdated={fetchBucket}



          />


        )

      }








    </div>


  );

}



export default BucketDetailPage;
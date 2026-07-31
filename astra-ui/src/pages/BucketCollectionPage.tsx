import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  motion
} from "framer-motion";


import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";


import {
  onAuthStateChanged
} from "firebase/auth";


import {
  auth,
  db
} from "../firebase/firebaseConfig";


import AddBucketModal from "../components/AddBucketModal";








function BucketCollectionPage(){



  const navigate = useNavigate();





  const [buckets,setBuckets] =

    useState<any[]>([]);



  const [currentUser,setCurrentUser] =

    useState<any>(null);



  const [addOpen,setAddOpen] =

    useState(false);



  const [loading,setLoading] =

    useState(true);











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









  useEffect(()=>{



    const bucketQuery = query(



      collection(

        db,

        "bucketLists"

      ),




      orderBy(

        "createdAt",

        "desc"

      )


    );








    const unsubscribe =

      onSnapshot(



        bucketQuery,



        (snapshot)=>{

  console.log(
        "BUCKET SNAPSHOT SIZE:",
        snapshot.size
      );
          const data =

            snapshot.docs.map(doc=>({


              id:doc.id,


              ...doc.data()


            }));

   console.log(
        "BUCKET DATA:",
        data
      );


          setBuckets(data);


          setLoading(false);



        },



        (error)=>{


          console.error(

            "Bucket listener error:",

            error

          );


          setLoading(false);


        }



      );






    return ()=>unsubscribe();



  },[]);









  return (



    <div


      className="
        min-h-screen
        w-screen
        overflow-y-auto
        bg-black
        px-8
        py-20
        text-white
      "


    >







      <div


        className="
          mx-auto
          max-w-5xl
        "


      >








        <div


          className="
            text-center
          "


        >





          <div className="text-6xl">

            🌌

          </div>






          <h1


            className="
              mt-6
              text-5xl
              font-light
              tracking-[0.3em]
            "


          >

            Bucket List

          </h1>






          <p


            className="
              mt-5
              text-xs
              tracking-[0.5em]
              text-purple-300
            "


          >

            Dreams waiting to become memories.

          </p>






        </div>









   









        {

          loading && (


            <p className="
              mt-20
              text-center
              text-white/50
            ">

              Discovering dreams...

            </p>


          )

        }









        {

          !loading && buckets.length===0 && (


            <div


              className="
                mt-20
                rounded-3xl
                border
                border-white/10
                bg-white/[0.04]
                p-12
                text-center
              "


            >


              <div className="text-5xl">

                🌌

              </div>



              <h2 className="
                mt-6
                text-2xl
                font-light
              ">

                No dreams yet

              </h2>



              <p className="
                mt-4
                text-white/60
              ">

                Add the first wish to your universe.

              </p>



            </div>


          )

        }









        <div


          className="
            mt-16
            space-y-8
          "


        >







        {

          buckets.map(bucket=>(



            <motion.div



              key={bucket.id}




              onClick={()=>navigate(

                `/bucket-list/${bucket.id}`

              )}



              whileHover={{

                y:-8,

                scale:1.01

              }}



              className={`

                cursor-pointer
                rounded-3xl
                border
                p-6 md:p-10
                transition


                ${
                  bucket.authorName
                  ?.toLowerCase()
                  .trim()==="eraya"

                  ?

                  "border-pink-300/40 bg-pink-500/5"

                  :

                  "border-blue-300/40 bg-blue-500/5"

                }

              `}



            >








              <div className="flex justify-between">





                <div className="text-5xl">

                  🌌

                </div>







                {


                  currentUser &&

                  bucket.authorId !== currentUser.uid &&

                  !bucket.viewedBy?.includes(

                    currentUser.uid

                  )

                  &&

                  (


    <span


className="
  rounded-full
    border
    border-pink-300/40
    bg-pink-400/10
    px-3
    py-3
    text-xs md:text-[9px]
    tracking-[0.25em]
    text-pink-200
    backdrop-blur-md
"


>

  NEW ✨

</span>


                  )


                }





              </div>









              <h2


                className="
                  mt-8
                  text-3xl
                  font-light
                "


              >

                {bucket.title}

              </h2>









              <p


                className="
                  mt-4
                  text-white/70
                "


              >

                {bucket.shortDescription}

              </p>









              <div


                className="
                  mt-8
                  flex
                  justify-between
                  text-xs
                  tracking-widest
                  text-white/50
                "


              >




                <span>

                  Created by {bucket.authorName}

                </span>





                <span>


                  {

                    bucket.createdAt &&

                    bucket.createdAt
                    .toDate()
                    .toLocaleDateString()

                  }


                </span>





              </div>









              {

                bucket.completed && (


                  <div

                    className="
                      mt-6
                      text-xs
                      tracking-widest
                      text-green-300
                    "

                  >

                    ✓ COMPLETED

                  </div>


                )

              }







            </motion.div>


          ))



        }








        </div>









      </div>





<button


  onClick={()=>setAddOpen(true)}



  className="fixed bottom-20 md:bottom-28 right-4 md:right-8 z-[100] cursor-pointer rounded-full border border-purple-300/30 bg-purple-500/10 px-3 md:px-4 py-3 md:py-4 text-xs tracking-[0.4em] backdrop-blur-xl transition hover:bg-purple-500/20"


>

  + ADD WISH 🌌

</button>



      {

        addOpen && (


          <AddBucketModal


            onClose={()=>setAddOpen(false)}


            onAdded={()=>{}}


          />


        )

      }









    </div>


  );

}



export default BucketCollectionPage;
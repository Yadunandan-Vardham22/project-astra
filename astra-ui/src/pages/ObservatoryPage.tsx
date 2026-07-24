import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import HomeButton from "../components/HomeButton";
import AddStoryModal from "../components/AddStoryModal";







function ObservatoryPage(){


  const navigate = useNavigate();


  const [stories,setStories] = useState<any[]>([]);


  const [loading,setLoading] = useState(true);


  const [showAddStory,setShowAddStory] = useState(false);









  const fetchStories = async()=>{


    try{


      const snapshot = await getDocs(

        collection(db,"stories")

      );



      const data = snapshot.docs.map(doc=>({


        id:doc.id,

        ...doc.data()


      }));



      setStories(data);



    }

    catch(error){


      console.error(

        "Error fetching stories:",

        error

      );


    }



    finally{


      setLoading(false);


    }


  };









  useEffect(()=>{


    fetchStories();



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

            🔭

          </div>





          <h1


            className="
              mt-6
              text-5xl
              font-light
              tracking-[0.3em]
            "


          >

            Observatory

          </h1>





          <p


            className="
              mt-5
              text-xs
              tracking-[0.5em]
              text-purple-300
            "


          >

            THE STAR ARCHIVE

          </p>




        </div>









        {
          loading && (

            <p


              className="
                mt-20
                text-center
                text-white/50
              "


            >

              Discovering stars...

            </p>

          )
        }









        {
          !loading && stories.length===0 && (


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

                ✦

              </div>





              <h2


                className="
                  mt-6
                  text-2xl
                  font-light
                "


              >

                The archive is empty

              </h2>





              <p


                className="
                  mt-4
                  text-white/60
                "


              >

                Create the first story in this universe.

              </p>







              <button


                onClick={()=>setShowAddStory(true)}



                className="
                  mt-8
                  cursor-pointer
                  rounded-full
                  border
                  border-purple-300/30
                  bg-purple-500/10
                  px-8
                  py-3
                  text-xs
                  tracking-[0.4em]
                "


              >

                ADD STORY

              </button>






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
          stories.map((story)=>(



            <div


              key={story.id}



              onClick={()=>navigate(

                `/observatory/${story.id}`

              )}



              className={`

                cursor-pointer
                rounded-3xl
                border
                p-10
                backdrop-blur-xl
                transition
                hover:scale-[1.01]


                ${
                  story.author==="eraya"

                  ?

                  "border-pink-300/40 bg-pink-500/5"

                  :

                  "border-purple-300/40 bg-purple-500/5"

                }

              `}



            >





              <p


                className="
                  text-xs
                  tracking-[0.5em]
                  text-purple-300
                "


              >

                STORY

              </p>









              <h2


                className="
                  mt-5
                  text-3xl
                  font-light
                "


              >

                ✦ {story.title}

              </h2>









              <p


                className="
                  mt-5
                  line-clamp-3
                  leading-relaxed
                  text-white/70
                "


              >

                {story.description}

              </p>









              <p


                className="
                  mt-8
                  text-xs
                  tracking-widest
                  text-white/50
                "


              >

                Added by {story.author}

              </p>









            </div>


          ))
        }







        </div>









        {
          stories.length>0 && (


            <button


              onClick={()=>setShowAddStory(true)}



              className="
                fixed
                bottom-32
                right-10
                cursor-pointer
                rounded-full
                border
                border-purple-300/40
                bg-purple-500/20
                px-6
                py-4
                text-xs
                tracking-widest
                backdrop-blur-xl
              "


            >

             + ADD STORY

            </button>


          )
        }









      </div>









      {
        showAddStory && (


          <AddStoryModal


            onClose={()=>setShowAddStory(false)}


            onAdded={fetchStories}


          />


        )
      }








    </div>


  );

}



export default ObservatoryPage;
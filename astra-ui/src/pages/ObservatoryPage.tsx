import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,orderBy
} from "firebase/firestore";


import {
  db,
  auth
} from "../firebase/firebaseConfig";

import {
  onAuthStateChanged
} from "firebase/auth";


import AddStoryModal from "../components/AddStoryModal";
import FloatingFirefliesBackground from "../components/FloatingFirefliesBackground";







function ObservatoryPage(){


  const navigate = useNavigate();


  const [stories,setStories] = useState<any[]>([]);


  const [loading,setLoading] = useState(true);


  const [showAddStory,setShowAddStory] = useState(false);


const [newStories,setNewStories] =
  useState<string[]>([]);

const [authorFilter,setAuthorFilter] =
  useState<"all"|"icarus"|"eraya"|"favorites">("all");

const [starName,setStarName] =
  useState("");

const [favoriteStoryIds,setFavoriteStoryIds] =
  useState<string[]>([]);




  const fetchStories = async()=>{


    try{


  const storiesQuery = query(

  collection(db,"stories"),

  orderBy(
    "createdAt",
    "desc"
  )

);


const snapshot = await getDocs(

  storiesQuery

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


  const unsubscribeAuth =

    onAuthStateChanged(

      auth,

      async(user)=>{


        if(!user)
          return;



        const userRef = doc(

          db,

          "users",

          user.uid

        );



        const userSnapshot =

          await getDoc(userRef);



        if(!userSnapshot.exists())
          return;



        const data =
          userSnapshot.data();



        const currentStarName =

          (
            data.starName || ""
          ).toLowerCase();



        setStarName(
          currentStarName
        );

        setFavoriteStoryIds(
          Array.isArray(data.favoriteStoryIds)
            ? data.favoriteStoryIds
            : []
        );



        if(!currentStarName)
          return;





        const notificationQuery = query(

          collection(
            db,
            "notifications"
          ),


          where(
            "receiver",
            "==",
            currentStarName
          ),


          where(
            "read",
            "==",
            false
          )

        );





        const unsubscribe =

          onSnapshot(

            notificationQuery,

            (snapshot)=>{


              const storyIds =

                snapshot.docs

                .filter(

                  doc =>

                    doc.data().type === "observatory"

                )

                .map(

                  doc =>

                    doc.data().metadata?.storyId

                )

                .filter(

                  (id): id is string =>

                    Boolean(id)

                );




              setNewStories(
                storyIds
              );


            }


          );




        return ()=>unsubscribe();


      }


    );





  return ()=>unsubscribeAuth();



},[]);

  useEffect(()=>{


    fetchStories();



  },[]);



function formatDate(timestamp:any){

  if(!timestamp)
    return "";

  const date =
    timestamp.toDate();

  return date.toLocaleDateString(
    "en-US",
    {
      month:"long",
      day:"numeric",
      year:"numeric"
    }
  );

}

const filteredStories = stories.filter((story) => {
  if (authorFilter === "favorites") {
    return favoriteStoryIds.includes(story.id);
  }

  if (authorFilter === "all") {
    return true;
  }

  return (story.author || "").toLowerCase() === authorFilter;
});






  return (


    <div


      className="
        relative
        min-h-screen
        w-screen
        overflow-y-auto
        bg-black
        px-8
        pb-20
        pt-8
        text-white
      "


    >

      <FloatingFirefliesBackground />





     









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



          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">
              Observatory
            </h1>
            <div className="text-4xl">🔭</div>
          </div>

          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">
            THE STAR ARCHIVE
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { label: "All", value: "all" },
              { label: "Icarus", value: "icarus" },
              { label: "Eraya", value: "eraya" },
              { label: "Favorites", value: "favorites" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setAuthorFilter(filter.value as any)}
                className={
                  `rounded-full border px-4 py-2 text-xs tracking-[0.35em] transition ${
                    authorFilter === filter.value
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                  }`
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          {authorFilter === "favorites" && !loading && favoriteStoryIds.length === 0 && (
            <p className="mt-3 text-center text-sm text-white/60">
              No favourite chapters yet.
            </p>
          )}

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
            grid
            gap-6
            md:grid-cols-2
          "


        >







        {
          filteredStories.map((story,index)=>(



            <div


              key={story.id}



              onClick={()=>navigate(

                `/observatory/${story.id}`

              )}



              className={`

                group
                cursor-pointer
                rounded-3xl
                border
                p-5 md:p-6
                text-left
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

  CHAPTER {String(index + 1).padStart(2,"0")}

</p>









 <div
  className="
    mt-4
    flex
    flex-wrap
    items-center
    justify-between
    gap-3
  "
>

  <h2

    className="
      text-2xl
      font-light
    "

  >

    ✦ {story.title}

  </h2>



  {
    newStories.includes(story.id) && (

      <span

        className="
          rounded-full
          border
          border-purple-300/40
          bg-purple-500/20
          px-3
          py-1
          text-xs md:text-[10px]
          tracking-widest
          text-purple-200
        "

      >

        NEW ✨

      </span>

    )
  }


</div>









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









<div

  className="
    mt-8
    text-xs
    tracking-widest
    text-white/50
  "

>

  <p>

    Added by {story.author}

  </p>



  {
    story.createdAt && (

      <p

        className="
          mt-2
        "

      >

        {formatDate(story.createdAt)}

      </p>

    )
  }


</div>









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
                py-3 md:py-4
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
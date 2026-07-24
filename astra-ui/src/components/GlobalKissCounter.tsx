import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";    

import {
    auth,
    db
} from "../firebase/firebaseConfig";

import {
  createNotification
} from "../services/notificationService";



interface GlobalKissCounterProps {

    starName: string;

}







function GlobalKissCounter({

    starName

}: GlobalKissCounterProps) {



    const [open, setOpen] = useState(false);


    const [selectedKiss, setSelectedKiss] =
        useState<"sweet" | "deep" | null>(null);


    const [note, setNote] =
        useState("");


    const [sending, setSending] =
        useState(false);
    const [cooldownMessage, setCooldownMessage] =
        useState("");




    if (starName !== "eraya") {

        return null;

    }









    const sendKiss = async () => {


        if (!selectedKiss)
            return;


        if (!auth.currentUser)
            return;



        const reward =
            selectedKiss === "deep"
                ? 25
                : 5;



        const kissNote =
            note.trim();

        const now = new Date();



        try {


            const usersRef =
                collection(db, "users");





            const erayaQuery =
                query(

                    usersRef,

                    where(
                        "starName",
                        "==",
                        "eraya"
                    )

                );



            const icarusQuery =
                query(

                    usersRef,

                    where(
                        "starName",
                        "==",
                        "icarus"
                    )

                );





            const erayaSnapshot =
                await getDocs(erayaQuery);



            const icarusSnapshot =
                await getDocs(icarusQuery);





            if (
                erayaSnapshot.empty ||
                icarusSnapshot.empty
            )
                return;





            const erayaDoc =
                erayaSnapshot.docs[0];

            const erayaData =
                erayaDoc.data();


            const resetTime =
                erayaData.kissCooldownResetAt?.toDate();


            let normalCount =
                erayaData.normalKissesSentThisHour || 0;


            let lipLockCount =
                erayaData.lipLocksSentThisHour || 0;



            if (
                resetTime &&
                now > resetTime
            ) {

                normalCount = 0;

                lipLockCount = 0;

            }
            const icarusDoc =
                icarusSnapshot.docs[0];


            if (
                selectedKiss === "sweet" &&
                normalCount >= 5
            ) {

                setCooldownMessage(
                    "💋 Sweet kisses are resting. Try again in a little while."
                );

                return;

            }



            if (
                selectedKiss === "deep" &&
                lipLockCount >= 2
            ) {

                setCooldownMessage(
                    "❤️‍🔥 The universe needs time before another Lip Lock."
                );

                return;

            }




            await updateDoc(

                doc(
                    db,
                    "users",
                    icarusDoc.id
                ),

                {

                    kissesReceived:
                        increment(1),


                    latestKissNote:
                        kissNote,



                    ...(selectedKiss === "deep"

                        ?

                        {

                            lipLocksReceived:
                                increment(1)

                        }

                        :

                        {

                            sweetKissesReceived:
                                increment(1)

                        }

                    )

                }

            );








            await updateDoc(

                doc(
                    db,
                    "users",
                    erayaDoc.id
                ),

                {

                    stardust:
                        increment(reward),



                    normalKissesSentThisHour:

                        selectedKiss === "sweet"

                            ?

                            normalCount + 1

                            :

                            normalCount,




                    lipLocksSentThisHour:

                        selectedKiss === "deep"

                            ?

                            lipLockCount + 1

                            :

                            lipLockCount,




                    kissCooldownResetAt:

                        resetTime ||

                        new Date(
                            now.getTime() + 60 * 60 * 1000
                        )


                }

            );
            console.log("Creating notification...");
            setSending(true);

await createNotification({

  receiver:"icarus",

  sender:"eraya",

  type:"kiss",

  title:

    selectedKiss==="deep"

    ?

    "A Lip Lock from Eraya ❤️‍🔥"

    :

    "A Sweet Kiss from Eraya 💋",



  message:

    kissNote ||

    "A kiss travelled across the stars ✨",


  metadata:{

    kissType:

      selectedKiss

  }

});
console.log(
  "Notification created"
);







            





            setTimeout(() => {


                setSending(false);

                setOpen(false);

                setSelectedKiss(null);

                setNote("");

                setCooldownMessage("");

            }, 2200);




        }

        catch (error) {


            console.error(

                "Kiss failed",

                error

            );


        }


    };









    return (

        <div

            className="
        fixed
        bottom-8
        right-8
        z-[300]
        
      "

        >







            <AnimatePresence>


                {

                    open && (

                        <motion.div


                            onClick={() => {

                                setCooldownMessage("");

                                setOpen(!open);

                            }}



                            className="
              fixed
              inset-0
              z-[250]
              bg-transparent
            "


                        />

                    )

                }


            </AnimatePresence>









            <AnimatePresence>


                {

                    open && !sending && (


                        <motion.div


                            onClick={(e) =>
                                e.stopPropagation()
                            }



                            initial={{

                                opacity: 0,

                                scale: 0.2,

                                y: 60

                            }}



                            animate={{

                                opacity: 1,

                                scale: 1,

                                y: 0

                            }}



                            exit={{

                                opacity: 0,

                                scale: 0.2

                            }}



                            className="
              absolute
              bottom-24
              right-0
              z-[350]
              w-72
              rounded-3xl
              border
              border-purple-300/30
              bg-black/80
              p-6
              text-white
              backdrop-blur-xl
            "

                        >



                            <p className="
              mb-5
              text-center
            ">

                                Send a little love to Icarus ✦

                            </p>

                            {
                                cooldownMessage && (

                                    <p
                                        className="
        mb-4
        text-center
        text-xs
        text-purple-200
      "
                                    >

                                        {cooldownMessage}

                                    </p>

                                )
                            }





                            <button


                                onClick={() =>
                                    setSelectedKiss("sweet")
                                }


                                className={`

                mb-3

                w-full

                cursor-pointer

                rounded-2xl

                border

                p-3


                ${selectedKiss === "sweet"

                                        ?

                                        "border-pink-400 bg-pink-400/20"

                                        :

                                        "border-white/20"

                                    }

              `}

                            >

                                💋 Sweet Kiss


                                <div className="text-xs opacity-70">

                                    +5 Stardust

                                </div>


                            </button>









                            <button


                                onClick={() =>
                                    setSelectedKiss("deep")
                                }


                                className={`

                w-full

                cursor-pointer

                rounded-2xl

                border

                p-3


                ${selectedKiss === "deep"

                                        ?

                                        "border-red-400 bg-red-400/20"

                                        :

                                        "border-white/20"

                                    }

              `}

                            >

                                ❤️‍🔥 Lip Lock


                                <div className="text-xs opacity-70">

                                    +25 Stardust

                                </div>


                            </button>









                            {

                                selectedKiss && (


                                    <>


                                        <textarea


                                            value={note}


                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }



                                            placeholder="Describe the kiss..."



                                            className="
                      mt-5
                      h-20
                      w-full
                      rounded-xl
                      border
                      border-white/20
                      bg-white/5
                      p-3
                    "

                                        />





                                        <button


                                            onClick={sendKiss}



                                            className="
                      mt-4
                      w-full
                      cursor-pointer
                      rounded-full
                      bg-white/10
                      py-3
                    "


                                        >

                                            Send Kiss ✦

                                        </button>


                                    </>

                                )

                            }





                        </motion.div>


                    )

                }


            </AnimatePresence>









            {

                sending && (


                    <motion.div


                        className="
              fixed
              inset-0
              pointer-events-none
              z-[200]
            "

                    >



                        <motion.div


                            initial={{

                                x: window.innerWidth - 90,

                                y: window.innerHeight - 90

                            }}



                            animate={{

                                x: window.innerWidth / 2,

                                y: 120

                            }}



                            transition={{

                                duration: 2

                            }}



                            className="
                absolute
                text-5xl
              "

                        >

                            {
                                selectedKiss === "deep"
                                    ?
                                    "❤️‍🔥"
                                    :
                                    "💋"
                            }


                        </motion.div>







                        <motion.div


                            initial={{

                                opacity: 0,

                                y: 20

                            }}



                            animate={{

                                opacity: 1,

                                y: -40

                            }}



                            transition={{

                                delay: 1.8

                            }}



                            className="
                absolute
                top-32
                left-1/2
                -translate-x-1/2
                text-xl
                text-purple-200
              "

                        >

                            +

                            {
                                selectedKiss === "deep"
                                    ?
                                    25
                                    :
                                    5
                            }

                            Stardust ✦


                        </motion.div>


                    </motion.div>


                )

            }









            <motion.button


                onClick={() => setOpen(!open)}



                animate={{

                    y: [0, -12, 0]

                }}



                transition={{

                    duration: 3,

                    repeat: Infinity

                }}



                className="
                  relative
  z-[400]
          cursor-pointer
          flex
          h-16
          w-16
          flex-col
          items-center
          justify-center
          rounded-full
          border
          border-pink-300/40
          bg-black/40
          text-white
          backdrop-blur-xl
        "

            >


                <span className="text-2xl">

                    💋

                </span>


            </motion.button>






        </div>

    );

}



export default GlobalKissCounter;
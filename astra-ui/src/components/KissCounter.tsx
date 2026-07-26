import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    setDoc,
    increment
} from "firebase/firestore";

import {
    auth,
    db
} from "../firebase/firebaseConfig";




interface KissCounterProps {

    value: number;

    showCount: boolean;

    starName: string;

    sweetKisses: number;

    lipLocks: number;

    latestNote: string;

}






function KissCounter({

    value,

    showCount,

    starName,

    sweetKisses,

    lipLocks,

    latestNote

}: KissCounterProps) {



    const [open, setOpen] = useState(false);

    const [selectedKiss, setSelectedKiss] =
        useState<"sweet" | "deep" | null>(null);

    const [note, setNote] = useState("");

    const [sending, setSending] = useState(false);








    const sendKiss = async () => {


        if (!selectedKiss)
            return;


        if (!auth.currentUser)
            return;



        const reward =
            selectedKiss === "deep"
                ? 25
                : 5;

        const kissNote = note.trim();



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
            ) {

                console.log("User documents missing");

                return;

            }




            const erayaDoc =
                erayaSnapshot.docs[0];


            const icarusDoc =
                icarusSnapshot.docs[0];



            console.log(
                "Saving kiss note:",
                kissNote
            );



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
                        increment(reward)

                }

            );

            await setDoc(

                doc(
                    db,
                    "stardust",
                    erayaDoc.id
                ),

                {
                    total:
                        increment(reward)
                },

                {
                    merge: true
                }

            );






            setSending(true);





            setTimeout(() => {


                setSending(false);

                setOpen(false);

                setSelectedKiss(null);

                setNote("");



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
        z-50
      "

        >







            <AnimatePresence>


                {

                    open && (

                        <motion.div


                            onClick={() => setOpen(false)}


                            initial={{
                                opacity: 0
                            }}


                            animate={{
                                opacity: 1
                            }}


                            exit={{
                                opacity: 0
                            }}



                            className="
              fixed
              inset-0
              z-40
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
              z-50
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



                            {

                                starName === "icarus"

                                    ?

                                    <div className="space-y-5">


                                        <p className="
                text-center
                tracking-widest
              ">

                                            YOUR KISSES ✦

                                        </p>


                                        <p>
                                            💋 Total Kisses: {value}
                                        </p>


                                        <p>
                                            💋 Sweet Kisses: {sweetKisses}
                                        </p>


                                        <p>
                                            ❤️‍🔥 Lip Locks: {lipLocks}
                                        </p>



                                        <div>

                                            <p className="text-white/50">

                                                Latest Kiss

                                            </p>


                                            <p className="mt-2 text-purple-200">

                                                {
                                                    latestNote ||
                                                    "No kisses yet"
                                                }

                                            </p>

                                        </div>


                                    </div>


                                    :


                                    <div>


                                        <p className="
                mb-5
                text-center
              ">

                                            Send a little love to Icarus ✦

                                        </p>




                                        <button


                                            onClick={() => setSelectedKiss("sweet")}


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


                                            onClick={() => setSelectedKiss("deep")}


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
                                                        disabled={!note.trim()}

                                                        className="
                        disabled:opacity-40
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


                                    </div>


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
              z-[100]
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



                {

                    showCount && (

                        <span className="text-xs">

                            {value}

                        </span>

                    )

                }



            </motion.button>






        </div>

    );

}



export default KissCounter;
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";
import { starUsers } from "../config/starUsers";

import spaceImage from "../assets/holding-hands.png";
import CosmicTrails from "../components/CosmicTrails";


function LoginPage() {

  const [starName, setStarName] = useState("");
  const [secret, setSecret] = useState("");

  const [starFocus, setStarFocus] = useState(false);
  const [secretFocus, setSecretFocus] = useState(false);

  const navigate = useNavigate();


  const handleLogin = async () => {
    try {

      const email =
        starUsers[starName.toLowerCase()];


      if (!email) {
        alert("The stars could not find you.");
        return;
      }


      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          secret
        );


      const uid = result.user.uid;


      const userRef = doc(
        db,
        "users",
        uid
      );


      const userSnap =
        await getDoc(userRef);


      if (!userSnap.exists()) {

        alert(
          "Your constellation is missing."
        );

        return;
      }


      const userData =
        userSnap.data();


      console.log(
        "USER PROFILE:",
        userData
      );


      if (userData.role === "starKeeper") {

        navigate("/home");

      } else {

        navigate("/verify");

      }


    } catch (error) {

      console.log(error);

      alert(
        "The secret does not match our universe."
      );

    }
  };


  return (
    <div
      className="
        relative
        h-screen
        w-screen
        overflow-hidden
        bg-black
      "
    >

      <div
        className="
          absolute
          inset-0
          bg-black
        "
      />


      <div
        className="
          absolute
          inset-0
          bg-contain
          bg-no-repeat
          bg-center
        "
        style={{
          backgroundImage:
            `url(${spaceImage})`,
        }}
      />


      <CosmicTrails />


      <div
        className="
          relative
          z-10
          flex
          h-full
          items-center
          justify-start
          pl-24
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
            filter: "blur(12px)",
          }}

          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
          }}

          transition={{
            duration: 1.8,
          }}

          className="
            flex
            w-[340px]
            flex-col
            items-start
          "
        >


          <motion.h1
            animate={{
              textShadow: [
                "0 0 15px rgba(245,235,215,0.4)",
                "0 0 35px rgba(245,235,215,0.8)",
                "0 0 15px rgba(245,235,215,0.4)",
              ],
            }}

            transition={{
              duration: 4,
              repeat: Infinity,
            }}

            className="
              text-4xl
              font-thin
              tracking-wide
              text-[#F5EBD7]
            "

            style={{
              fontFamily:
                '"Playfair Display", serif',
            }}
          >
            Welcome, My star.
          </motion.h1>



          <div
            className="
              mt-16
              flex
              w-full
              flex-col
              gap-10
            "
          >


            <div
              className="
                relative
                w-full
              "
            >

              <input

                placeholder="Star Name"

                value={starName}

                onChange={(e)=>
                  setStarName(e.target.value)
                }

                onFocus={() =>
                  setStarFocus(true)
                }

                onBlur={() =>
                  setStarFocus(false)
                }

                className="
                  w-full
                  bg-transparent
                  pb-3
                  text-left
                  text-sm
                  tracking-[0.3em]
                  text-[#B8F3FF]
                  outline-none
                  placeholder:text-[#B8F3FF]/80
                "

                style={{
                  textShadow: `
                    0 0 5px rgba(120,220,255,0.9),
                    0 0 15px rgba(120,220,255,0.8),
                    0 0 30px rgba(120,220,255,0.6)
                  `,
                }}

              />


              <motion.div

                animate={{
                  opacity:[
                    0.4,
                    1,
                    0.4
                  ],

                  boxShadow:[
                    "0 0 5px rgba(120,220,255,0.5)",
                    "0 0 25px rgba(120,220,255,1)",
                    "0 0 5px rgba(120,220,255,0.5)"
                  ]
                }}

                transition={{
                  duration:3,
                  repeat:Infinity
                }}

                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-full
                  bg-[#9DEBFF]
                "
              />

            </div>




            <div
              className="
                relative
                w-full
              "
            >

              <input

                type="password"

                placeholder="Constellation Secret"

                value={secret}

                onChange={(e)=>
                  setSecret(e.target.value)
                }

                onFocus={() =>
                  setSecretFocus(true)
                }

                onBlur={() =>
                  setSecretFocus(false)
                }

                className="
                  w-full
                  bg-transparent
                  pb-3
                  pr-12
                  text-left
                  text-sm
                  tracking-[0.3em]
                  text-[#FFD1C1]
                  outline-none
                  placeholder:text-[#FFD1C1]/80
                "

                style={{
                  textShadow: `
                    0 0 5px rgba(255,170,130,0.9),
                    0 0 15px rgba(255,170,130,0.8),
                    0 0 30px rgba(255,170,130,0.6)
                  `,
                }}

              />


              <motion.div

                animate={{
                  opacity:[
                    0.4,
                    1,
                    0.4
                  ],

                  boxShadow:[
                    "0 0 5px rgba(255,170,130,0.5)",
                    "0 0 25px rgba(255,170,130,1)",
                    "0 0 5px rgba(255,170,130,0.5)"
                  ]
                }}

                transition={{
                  duration:3,
                  repeat:Infinity
                }}

                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                  w-full
                  bg-[#FFD1C1]
                "

              />


              <motion.button

                onClick={handleLogin}

                whileHover={{
                  x:6,
                  scale:1.15
                }}

                whileTap={{
                  scale:0.9
                }}

                className="
                  absolute
                  right-0
                  bottom-2
                  cursor-pointer
                  text-xl
                  text-[#FFD1C1]
                "

                style={{
                  textShadow:
                    "0 0 15px rgba(255,170,130,0.9)",
                }}

              >
                →
              </motion.button>


            </div>


          </div>


        </motion.div>


      </div>


    </div>
  );
}


export default LoginPage;
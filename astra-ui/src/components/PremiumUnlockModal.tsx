import { motion } from "framer-motion";


interface PremiumUnlockModalProps {

  realm:string;

  cost:number;

  perks:string[];

  onClose:()=>void;

}



function PremiumUnlockModal({

  realm,

  cost,

  perks,

  onClose

}:PremiumUnlockModalProps){



  return (

    <div

      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-md
      "

    >





      <motion.div


        initial={{

          opacity:0,

          scale:0.7,

          y:40

        }}



        animate={{

          opacity:1,

          scale:1,

          y:0

        }}



        transition={{

          type:"spring",

          stiffness:180,

          damping:15

        }}



        className="
          relative
          w-96
          rounded-3xl
          border
          border-purple-300/30
          bg-black/70
          p-8
          text-white
          shadow-2xl
        "


      >






        {/* Glow */}


        <div

          className="
            absolute
            inset-0
            rounded-3xl
            bg-purple-500/10
            blur-3xl
          "

        />








        <div className="relative z-10">






          <div

            className="
              mb-5
              text-center
              text-5xl
            "

          >

            ✦

          </div>







          <h2

            className="
              text-center
              text-2xl
              font-light
              tracking-widest
            "

          >

            {realm}

          </h2>








          <p

            className="
              mt-4
              text-center
              text-sm
              text-purple-100
            "

          >

            This realm is waiting to be discovered.

            Unlock it with Stardust ✦

          </p>








          <div

            className="
              mt-6
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-4
            "

          >

            <p className="mb-3 text-sm">

              Unlocks:

            </p>



            <ul

              className="
                space-y-2
                text-sm
                text-purple-100
              "

            >

              {
                perks.map((perk,index)=>(

                  <li key={index}>

                    ✦ {perk}

                  </li>

                ))
              }


            </ul>



          </div>









          <div

            className="
              mt-6
              text-center
              text-xl
            "

          >

            {cost} Stardust ✦


          </div>








          <button


            className="
              mt-6
              w-full
              cursor-pointer
              rounded-full
              bg-white/10
              py-3
              text-sm
              tracking-widest
              transition
              hover:bg-white/20
            "


          >

            Unlock Realm ✦


          </button>








          <button


            onClick={onClose}



            className="
              mt-3
              w-full
              cursor-pointer
              py-2
              text-xs
              text-white/60
            "


          >

            Maybe later

          </button>






        </div>





      </motion.div>



    </div>

  );

}



export default PremiumUnlockModal;
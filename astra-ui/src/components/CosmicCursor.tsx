import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


type Particle = {

  id:number;

  x:number;

  y:number;

  size:number;

  color:string;

};





function CosmicCursor() {


  const [particles,setParticles] =
    useState<Particle[]>([]);



  const lastPosition =
    useRef({

      x:0,

      y:0

    });






  useEffect(()=>{


    const handleMove =
      (event:MouseEvent)=>{


        const distance = Math.sqrt(

          Math.pow(
            event.clientX - lastPosition.current.x,
            2
          )

          +

          Math.pow(
            event.clientY - lastPosition.current.y,
            2
          )

        );



        lastPosition.current = {

          x:event.clientX,

          y:event.clientY

        };




        // only react to meaningful movement

        if(distance < 15) return;




        const amount =
          distance > 80 ? 3 : 1;



        const newParticles =
          Array.from(
            {
              length:amount
            },

            (_,index)=>({


              id:
                Date.now()+index,


              x:
                event.clientX +
                (Math.random()*30-15),



              y:
                event.clientY +
                (Math.random()*30-15),



              size:

                Math.random()*5+2,



              color:

                Math.random()>0.5

                ?

                "rgba(192,132,252,0.9)"

                :

                "rgba(125,211,252,0.9)"



            })

          );




        setParticles(prev=>[

          ...prev,

          ...newParticles

        ]);



      };





    window.addEventListener(

      "mousemove",

      handleMove

    );




    return ()=>{


      window.removeEventListener(

        "mousemove",

        handleMove

      );


    };


  },[]);







  useEffect(()=>{


    const cleanup =

      setInterval(()=>{


        setParticles(prev=>

          prev.filter(

            particle =>

              Date.now() - particle.id < 1500

          )

        );


      },500);




    return ()=>clearInterval(cleanup);



  },[]);







  return (


    <div

      className="

        fixed

        inset-0

        pointer-events-none

        z-30

      "

    >




      {

        particles.map((particle)=>(


          <motion.div



            key={particle.id}



            initial={{


              opacity:0,

              scale:0


            }}




            animate={{


              opacity:[

                0,

                1,

                0

              ],



              scale:[

                0.5,

                1.5,

                0

              ],



              x:

                (Math.random()-0.5)*80,



              y:

                (Math.random()-0.5)*80



            }}




            transition={{


              duration:1.8,

              ease:"easeOut"


            }}




            className="

              absolute

              rounded-full

            "



            style={{


              left:
                particle.x,


              top:
                particle.y,



              width:
                particle.size,


              height:
                particle.size,



              background:
                particle.color,



              boxShadow:

              `

              0 0 12px ${particle.color},

              0 0 30px ${particle.color}

              `



            }}



          />


        ))

      }




    </div>


  );


}



export default CosmicCursor;
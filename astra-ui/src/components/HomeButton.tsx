import { useNavigate } from "react-router-dom";



function HomeButton(){



  const navigate = useNavigate();





  return (


    <button


      onClick={()=>navigate("/home")}



      className="
        cursor-pointer
        rounded-full
        border
        border-white/20
        bg-black/40
        px-5
        py-2
        text-xs
        tracking-widest
        text-white
        backdrop-blur-xl
        transition
        hover:bg-white/10
      "


    >

      HOME


    </button>


  );


}



export default HomeButton;
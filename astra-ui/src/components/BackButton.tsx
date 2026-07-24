import { useNavigate } from "react-router-dom";


interface BackButtonProps {

  path:string;

  label?:string;

}



function BackButton({

  path,

  label="Back"

}:BackButtonProps){


  const navigate = useNavigate();



  return (

    <button

      onClick={()=>navigate(path)}

      className="
        fixed
        left-6
        top-6
        z-50
        cursor-pointer
        rounded-full
        border
        border-white/20
        bg-white/10
        px-5
        py-2
        text-white
        backdrop-blur-xl
      "

    >

      ← {label}

    </button>

  );

}


export default BackButton;
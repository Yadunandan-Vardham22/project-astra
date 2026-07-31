import { useNavigate } from "react-router-dom";


interface BackButtonProps {
  path:string;
  label?:string;
  top?:string;
  left?:string;
}

function BackButton({
  path,
  label="Back",
  top="top-8",
  left="left-8",
}:BackButtonProps){
  const navigate = useNavigate();

  return (
    <button
      onClick={()=>navigate(path)}
      className={`
        fixed
        ${left}
        ${top}
        z-50
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
      `}
    >
      ← {label}
    </button>
  );
}


export default BackButton;
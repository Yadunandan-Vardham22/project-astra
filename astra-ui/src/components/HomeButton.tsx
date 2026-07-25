import { useNavigate } from "react-router-dom";

interface HomeButtonProps {
  label?: string;
  to?: string;
}

function HomeButton({
  label = "HOME",
  to = "/home",
}: HomeButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
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
      {label.toUpperCase()}
    </button>
  );
}

export default HomeButton;
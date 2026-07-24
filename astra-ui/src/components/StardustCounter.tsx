interface StardustCounterProps {

  value:number;

}







function StardustCounter({

  value

}:StardustCounterProps){



  return (

    <div

      className="
        flex
        items-center
        gap-1
      "

    >

      <span

        className="
          text-yellow-300
          text-sm
        "

      >

        ✦

      </span>



      <span

        className="
          text-xs
          tracking-widest
          text-yellow-200
        "

      >

        {value} Stardust

      </span>


    </div>

  );

}



export default StardustCounter;
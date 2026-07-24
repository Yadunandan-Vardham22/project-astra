import { useState } from "react";
import HomeButton from "../components/HomeButton";
import PremiumUnlockModal from "../components/PremiumUnlockModal";


function RomancePage(){


const [showUnlock,setShowUnlock]=useState(true);



return (

<div

className="
h-screen
w-screen
bg-black
text-white
flex
items-center
justify-center
"

>





<h1 className="text-4xl">

Romance

</h1>



{
showUnlock && (

<PremiumUnlockModal

realm="Romance Realm"

cost={500}

perks={[
"Love memories",
"Special romance challenges",
"Hidden messages"
]}

onClose={()=>setShowUnlock(false)}

/>

)

}



</div>

)

}


export default RomancePage;
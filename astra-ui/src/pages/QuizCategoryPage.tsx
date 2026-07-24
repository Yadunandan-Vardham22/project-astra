import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import BackButton from "../components/BackButton";





const quizzes:any = {


"about-us":{

title:"About Us",

icon:"💗",

reward:20,

questions:[

{
question:"What is something that always makes me smile?",

options:[
"My jokes",
"My effort",
"My random talks"
],

answer:1

},


{
question:"What makes our bond special?",

options:[
"Distance",
"Understanding",
"Luck"
],

answer:1

}

]

},






chemistry:{

title:"Chemistry",

icon:"🔥",

reward:25,

questions:[

{
question:"What is something about me that always makes you smile?",

options:[
"My teasing",
"My voice",
"My attention"
],

answer:0

},


{
question:"Who is more dramatic?",

options:[
"You",
"Me",
"Both"
],

answer:2

}

]

},






dreams:{

title:"Dreams",

icon:"🌙",

reward:15,

questions:[

{
question:"Where would you love to explore together?",

options:[
"Mountains",
"Beach",
"Space"
],

answer:2

}

]

}


};









function QuizCategoryPage(){



const {category}=useParams();



const quiz =
quizzes[category || "about-us"];





const [current,setCurrent]=useState(0);


const [selected,setSelected]=useState<number|null>(null);


const [feedback,setFeedback]=useState<string|null>(null);


const [earned,setEarned]=useState(false);



const question =
quiz.questions[current];







function submit(){



if(selected===null){

setFeedback("Choose a constellation first ✦");

return;

}




if(selected !== question.answer){

setFeedback(
"🌙 Not this constellation... but I loved your answer."
);

return;

}




if(current < quiz.questions.length-1){


setFeedback(
"✨ Correct. The stars remember."
);


setTimeout(()=>{

setCurrent(current+1);

setSelected(null);

setFeedback(null);


},1200);


}

else{


setEarned(true);


}



}








return(

<div

className="
min-h-screen
w-screen
bg-black
px-8
py-20
text-white
"

>


<BackButton

path="/quiz"

label="Quiz Galaxy"

/>







<div

className="
mx-auto
max-w-3xl
"

>






<div

className="
text-center
"

>


<div className="text-6xl">

{quiz.icon}

</div>




<h1

className="
mt-6
text-4xl
font-light
"

>

{quiz.title}

</h1>




<p

className="
mt-4
text-xs
tracking-[0.4em]
text-purple-300
"

>

QUESTION {current+1} / {quiz.questions.length}

</p>



</div>








{

!earned ? (



<motion.div


key={current}



initial={{

opacity:0,

x:50

}}



animate={{

opacity:1,

x:0

}}



transition={{

duration:0.5

}}



className="
mt-16
rounded-3xl
border
border-white/10
bg-white/[0.04]
p-10
"

>






<h2

className="
text-2xl
font-light
"

>

{question.question}

</h2>







<div

className="
mt-10
space-y-4
"

>


{

question.options.map(

(option:string,index:number)=>(



<button


key={index}


onClick={()=>setSelected(index)}



className={`

w-full
cursor-pointer
rounded-2xl
border
p-5
text-left
transition


${
selected===index

?

"border-purple-300 bg-purple-500/20"

:

"border-white/10 bg-white/[0.03]"

}

`}


>

{option}


</button>



)

)

}


</div>








{

feedback && (

<p

className="
mt-8
text-center
text-purple-200
"

>

{feedback}

</p>

)

}








<button


onClick={submit}



className="
mt-10
w-full
cursor-pointer
rounded-full
border
border-purple-300/30
bg-purple-500/10
py-4
text-xs
tracking-[0.4em]
hover:bg-purple-500/20
"

>

SUBMIT ANSWER ✦

</button>







</motion.div>



)

:

(



<motion.div


initial={{

opacity:0,

scale:0.5

}}



animate={{

opacity:1,

scale:1

}}



className="
mt-16
rounded-3xl
border
border-purple-300/30
bg-purple-500/10
p-10
text-center
"

>


<div className="text-6xl">

✨

</div>



<h2

className="
mt-6
text-3xl
font-light
"

>

Quiz Completed

</h2>




<p

className="
mt-5
text-purple-200
"

>

+{quiz.reward} Stardust earned

</p>




</motion.div>



)

}






</div>



</div>

);


}



export default QuizCategoryPage;
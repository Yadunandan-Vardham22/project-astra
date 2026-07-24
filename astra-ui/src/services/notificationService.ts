import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";


import {
  db
} from "../firebase/firebaseConfig";





interface NotificationPayload {

  receiver:string;

  sender:string;

  type:string;

  title:string;

  message:string;

  metadata?:any;

}








export async function createNotification(

  notification:NotificationPayload

){


  await addDoc(

    collection(

      db,

      "notifications"

    ),

    {

      ...notification,


      read:false,


      createdAt:
        serverTimestamp()


    }

  );


}
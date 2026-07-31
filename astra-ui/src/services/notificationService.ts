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

  referenceId?: string;

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

      receiver: notification.receiver.trim().toLowerCase(),


      read:false,


      createdAt:
        serverTimestamp()


    }

  );


}
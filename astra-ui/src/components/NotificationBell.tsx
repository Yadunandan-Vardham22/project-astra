import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

function NotificationBell(){
  const navigate = useNavigate();

  const [open,setOpen] = useState(false);
  const [notifications,setNotifications] = useState<any[]>([]);
  const [bellRef,setBellRef] = useState<HTMLDivElement|null>(null);
  const [anchorRight, setAnchorRight] = useState(false);

  useEffect(()=>{
    let unsubscribeNotifications:any;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user)=>{
      if(!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);
      if(!userSnapshot.exists()) return;

      const data = userSnapshot.data();
      const currentStarName = (data.starName || "").toLowerCase();
      if(!currentStarName) return;

      const notificationQuery = query(
        collection(db, "notifications"),
        where("receiver","==", currentStarName)
      );

      unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot)=>{
        const data = snapshot.docs
          .map(doc=>{
            const notification = { id: doc.id, ...doc.data() } as any;
            const createdAt = notification.createdAt;
            notification.__createdAtMillis =
              createdAt?.toMillis?.() ??
              createdAt?.toDate?.()?.getTime?.() ??
              (typeof createdAt === 'number' ? createdAt : 0);
            return notification;
          })
          .sort((a:any,b:any) => b.__createdAtMillis - a.__createdAtMillis)
          .map(({ __createdAtMillis, ...rest }: any) => rest);

        setNotifications(data);
      }, (error)=>{
        console.error("Notification listener error:", error);
      });
    });

    return ()=>{
      unsubscribeAuth();
      if(unsubscribeNotifications) unsubscribeNotifications();
    };
  },[]);

  useEffect(()=>{
    function handleOutsideClick(event:MouseEvent){
      if(bellRef && !bellRef.contains(event.target as Node)){
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return ()=> document.removeEventListener("mousedown", handleOutsideClick);
  },[bellRef]);

  useEffect(()=>{
    if(!bellRef) return;
    const calc = ()=>{
      const rect = bellRef.getBoundingClientRect();
      setAnchorRight(rect.left > window.innerWidth/2);
    };
    calc();
    window.addEventListener("resize", calc);
    return ()=> window.removeEventListener("resize", calc);
  },[bellRef]);

  async function markNotificationRead(notification:any){
    if(notification.read === false){
      try{
        await updateDoc(doc(db, "notifications", notification.id), { read: true });
      }catch(err){
        console.error('Failed to mark notification read', err);
      }

      setNotifications(prev => prev.map(item => item.id === notification.id ? { ...item, read: true } : item));
    }
  }

  async function markNotificationsRead(){
    const unread = notifications.filter(n => n.read === false);
    for(const n of unread) await markNotificationRead(n);
  }

  function openNotifications(){
    setOpen(true);
  }

  const unreadCount = notifications.filter(notification => notification.read === false).length;

  async function handleNotificationClick(notification: any){
    // For notifications that route somewhere, mark read then navigate.
    if(notification.type === "observatory" && notification.metadata?.storyId){
      await markNotificationRead(notification);
      navigate(`/observatory/${notification.metadata.storyId}`);
      setOpen(false);
      return;
    }

    if(notification.type === "letter" && notification.metadata?.letterId){
      await markNotificationRead(notification);
      navigate(`/letters/${notification.metadata.category}/${notification.metadata.letterId}`);
      setOpen(false);
      return;
    }

    if(notification.type === "bucket" && notification.metadata?.bucketId){
      await markNotificationRead(notification);
      navigate(`/bucket-list/${notification.metadata.bucketId}`);
      setOpen(false);
      return;
    }

    if(notification.type === "quiz" && notification.metadata?.quizId){
      await markNotificationRead(notification);
      navigate(`/quiz/${notification.metadata.quizId}`);
      setOpen(false);
      return;
    }

    if(notification.type === "garden"){
      await markNotificationRead(notification);
      navigate(`/garden?entryId=${notification.metadata.gardenId}`);
      setOpen(false);
      return;
    }

    if(notification.type === "futureDream" && notification.metadata?.dreamId){
      await markNotificationRead(notification);
      navigate("/romance/future-dreams");
      setOpen(false);
      return;
    }

    if(notification.type === "midnight"){
      await markNotificationRead(notification);
      navigate("/romance/late-night");
      setOpen(false);
      return;
    }

    // For non-routable notifications (e.g. kiss), just mark read and close.
    await markNotificationRead(notification);
    setOpen(false);
  }

  return (
    <div ref={setBellRef} className="relative">
      <button onClick={()=>{ if(open) setOpen(false); else openNotifications(); }} className="relative cursor-pointer text-xl transition hover:scale-110">
        🔔
        {unreadCount>0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white">{unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className={`absolute mt-4 z-[200] rounded-3xl border border-white/20 bg-black/80 p-5 text-white backdrop-blur-xl ${anchorRight ? 'md:right-0 md:left-auto md:w-72' : 'md:left-0 md:right-auto md:w-72'} w-[calc(100%-2rem)] left-4 right-4 max-w-[20rem]`}>
            <h2 className="mb-5 text-sm tracking-widest">NOTIFICATIONS</h2>

            {notifications.length===0 ? (
              <p className="text-sm text-white/50">No notifications</p>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div key={notification.id} onClick={()=>handleNotificationClick(notification)} className={`cursor-pointer rounded-xl border border-white/10 p-3 transition hover:bg-white/10 ${notification.read === false ? 'bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_18px_rgba(56,189,248,0.18)]' : ''}`}>
                    <p className="text-sm flex items-center justify-between gap-3">
                      <span>{notification.title}</span>
                      {notification.read === false && (
                        <span className="rounded-full bg-cyan-500 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white">New</span>
                      )}
                    </p>
                    <p className="mt-2 text-xs text-white/60">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;

import { addDoc, collection, deleteDoc, doc, getDoc, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, writeBatch } from "@firebase/firestore";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon
} from "@heroicons/react/outline";

import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import Moment from 'react-moment';

function Post({ id, username, userImg, img, caption, likesCount }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  // const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () => 
      onSnapshot(
        query(
          collection(firestore,'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ), 
        (snap) => setComments(snap.docs)
      ), 
    [firestore, id]
  );

  // useEffect(
  //   () =>     
  //     setHasLiked(
  //       likes.findIndex((like) => like.id === session?.user?.uid) !== -1
  //     ),
  //   [likes]
  // );

  // useEffect(
  //   () => 
  //     onSnapshot(
  //       query(
  //         collection(firestore,'posts', id, 'likes'),
  //         orderBy('timestamp', 'desc')
  //       ), 
  //       (snap) => setLikes(snap.docs)
  //     ), 
  //   [firestore, id]
  // );


  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('');

    await addDoc(collection(firestore, 'posts', id, 'comments'), {
      comment: commentToSend,
      uid: session?.user?.uid,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    })
  }

  const likePost = async () => {
    const batch = writeBatch(firestore);
    const likeRef = doc(firestore, 'posts', id, 'likes', session.user.uid);
    const likeDocRef =  await getDoc(likeRef);
    const postRef = doc(firestore, 'posts', id);
    
    if (likeDocRef.exists()) {
      batch.set(postRef, { likesCount: increment(-1)}, { merge: true});
      batch.delete(likeRef);
      setHasLiked(false);
    } else {
      batch.set(postRef, { likesCount: increment(1)}, { merge: true});
      batch.set(likeRef, { username: session.user.username }, { merge: true });
      setHasLiked(true);
    }

    await batch.commit();
  }


  return (
    <div className="bg-white my-7 border rounded-sm">
      <div className="flex items-center p-5">
        <img className="rounded-full h-12 w-12 object-contain border p-1 mr-3" src={userImg} alt="" />
        <p className="flex-1 font-bold">{ username }</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      <img src={img} alt=""
        className="w-full object-cover"
      />
      { session && (<div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center space-x-4">
          <div onClick={() => likePost()}>
            {
              hasLiked ? 
              <HeartIconFilled className="iconBtn text-red-600" />
              :
              <HeartIcon className="iconBtn" />
            }
          </div>
          <ChatIcon className="iconBtn" />
          <PaperAirplaneIcon className="iconBtn" />
        </div>

        <BookmarkIcon className="iconBtn" />
      </div>)}
      {/* caption */}
      
      <p className="p-5 truncate">
        {
          (likesCount > 0) && (
            <p className="font-bold text-gray-500 text-sm mb-1"> 
              { likesCount } {likesCount === 1 ? "like" : "likes"}
            </p>
          )
        }
        <span className="font-bold mr-1">{ username } </span>
        { caption }
      </p>

      {/* comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {
            comments.map((comment) => (
              <div key={comment.id} className="flex items-center space-x-2 mb-3">
                <img className="h-7 rounded-full" src={ comment.data().userImage } alt="" />
                <p className="text-sm flex-1">
                  <span className="font-bold">{ comment.data().username }</span>
                  <span>{ " " }</span>
                  { comment.data().comment }
                </p>
                <Moment fromNow className="pr-5 text-xs"> 
                  { comment.data().timestamp?.toDate() }
                </Moment>
              </div>
            ))
          }
        </div>)
      }
      

      {/* input box  */}
      {session && (<form className="flex items-center p-4">
        <EmojiHappyIcon className="h-7" />
        <input 
          className="border-none flex-1 focus:ring-0 outline-none" 
          type="text" 
          placeholder="Comment..." 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!comment.trim()}
          onClick={sendComment}
          className="font-semibold text-blue-400">
          Post
        </button>
      </form>)}
    </div>
  )
}

export default Post

import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import Post from "./Post"

// const posts = [
//   {
//     id: '123',
//     username: 'rickem',
//     userImg: 'https://media.istockphoto.com/photos/learn-to-love-yourself-first-picture-id1291208214?b=1&k=20&m=1291208214&s=170667a&w=0&h=sAq9SonSuefj3d4WKy4KzJvUiLERXge9VgZO-oqKUOo=',
//     img: 'https://media.istockphoto.com/photos/colored-powder-explosion-abstract-closeup-dust-on-backdrop-colorful-picture-id1072093690?k=20&m=1072093690&s=612x612&w=0&h=Ns3WeEm1VrIHhZOmhiGY_fYKvIlbJrVADLqfxyPQVPM=',
//     caption: 'This is dope',
//   },
//   {
//     id: '1233',
//     username: 'rickem',
//     userImg: 'https://media.istockphoto.com/photos/learn-to-love-yourself-first-picture-id1291208214?b=1&k=20&m=1291208214&s=170667a&w=0&h=sAq9SonSuefj3d4WKy4KzJvUiLERXge9VgZO-oqKUOo=',
//     img: 'https://media.istockphoto.com/photos/colored-powder-explosion-abstract-closeup-dust-on-backdrop-colorful-picture-id1072093690?k=20&m=1072093690&s=612x612&w=0&h=Ns3WeEm1VrIHhZOmhiGY_fYKvIlbJrVADLqfxyPQVPM=',
//     caption: 'This is dope',
//   }
// ];

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => 
    onSnapshot(query(collection(firestore,'posts'), orderBy('timestamp', 'desc')), snap => {
      setPosts(snap.docs);
    }),
    [firestore]
  );

  return (
    <div>
      {
        posts.map((post, idx) => (
          <Post 
            key={idx} 
            id={post.id} 
            username={post.data().username}
            userImg={post.data().profileImg}
            img={post.data().image}
            caption={post.data().caption}
            likesCount={post.data()?.likesCount}
          />
        ))
      }
    </div>
  )
}

export default Posts

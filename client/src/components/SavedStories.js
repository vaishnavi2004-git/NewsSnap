import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function SavedStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (!auth.currentUser) {
        setStories([]);
        setLoading(false);
        return;
      }
      try {
        const userStoriesRef = collection(db, 'users', auth.currentUser.uid, 'savedStories');
        const snapshot = await getDocs(userStoriesRef);
        const storiesData = snapshot.docs.map(doc => doc.data());
        setStories(storiesData);
      } catch (err) {
        setStories([]);
      }
      setLoading(false);
    };
    fetchStories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!auth.currentUser) return <div>Please login to view your saved stories.</div>;

  return (
    <div style={{padding:'20px'}}>
      <h2 style={{color:'black'}}>Saved Stories</h2>
      <div style={{display:'flex',flexWrap:'wrap',gap:'20px',justifyContent:'center'}}>
        {stories.length === 0 ? (
          <div>No saved stories found.</div>
        ) : (
          stories.map((story, idx) => (
            <div key={idx} className="news-card" style={{
              width:'350px',
              boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
              borderRadius:'10px',
              background:'#fff',
              padding:'16px'
            }}>
              <h3 style={{color:'black'}}>{story.headline}</h3>
              {story.image && <img src={story.image} alt="" style={{width:"100%", maxHeight:"200px", objectFit:"cover", borderRadius:'6px'}} />}
              <p>{story.summary}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">Read Full Story</a>
              <div style={{fontSize:'0.9em',color:'#555',marginTop:'8px'}}>~30 sec read</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default SavedStories;
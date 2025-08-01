import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NewsFeed.css';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function NewsFeed({ category, search }) {
  const [saveFeedback, setSaveFeedback] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:5000/api/news?`;
    if (category) url += `category=${category}&`;
    if (search) url += `q=${encodeURIComponent(search)}&`;
    axios.get(url)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, search]);

  const saveStory = async (story) => {
    if (!auth.currentUser) {
      setSaveFeedback('Please login to save stories.');
      setTimeout(() => setSaveFeedback(""), 2000);
      return;
    }
    try {
      const userStoriesRef = collection(db, 'users', auth.currentUser.uid, 'savedStories');
      await addDoc(userStoriesRef, story);
      setSaveFeedback('Story saved!');
      setTimeout(() => setSaveFeedback(""), 2000);
    } catch (err) {
      setSaveFeedback('Failed to save story: ' + err.message);
      setTimeout(() => setSaveFeedback(""), 2000);
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-cards-container">
      {news.map((story, idx) => (
        <div key={idx} className="news-card">
          <h2 style={{color:'black'}}>{story.headline}</h2>
          {story.image && <img src={story.image} alt="" />}
          <p>{story.summary}</p>
          <div className="news-card-actions">
            <a href={story.url} target="_blank" rel="noopener noreferrer">Read Full Story</a>
            <button onClick={() => saveStory(story)} style={{color:'white'}}>Save</button>
            {saveFeedback && <div className="save-feedback">{saveFeedback}</div>}
          </div>
          <div className="news-card-meta">~30 sec read</div>
        </div>
      ))}
    </div>
  );
}
export default NewsFeed;
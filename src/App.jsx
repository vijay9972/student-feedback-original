import { useState, useEffect } from 'react'; // Added useEffect
import { db } from './firebase'; 
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from 'firebase/firestore'; // Added getDocs, orderBy, query
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    rating: '5',
    feedback_message: ''
  });

  const [status, setStatus] = useState('');
  const [feedbacks, setFeedbacks] = useState([]); // State to store list of feedback

  // NEW: Function to fetch data from Firebase
  const fetchFeedback = async () => {
    try {
      // Get reference to the collection, ordered by time
      const q = query(collection(db, "student_feedback"), orderBy("submitted_at", "desc"));
      const querySnapshot = await getDocs(q);
      
      // Convert database data to a simple array
      const feedbackList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFeedbacks(feedbackList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // NEW: Fetch data when the app loads
  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      await addDoc(collection(db, "student_feedback"), {
        student_name: formData.student_name,
        email: formData.email,
        rating: Number(formData.rating),
        feedback_message: formData.feedback_message,
        submitted_at: serverTimestamp()
      });

      setStatus('Success! Feedback saved.');
      setFormData({ student_name: '', email: '', rating: '5', feedback_message: '' });
      
      // Refresh the list after submitting
      fetchFeedback();
      
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus('Error submitting feedback.');
    }
  };

  return (
    <div className="container">
      <h1>Student Feedback App</h1>
      
      {/* SECTION 1: The Input Form */}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Rating:</label>
        <select name="rating" value={formData.rating} onChange={handleChange}>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Terrible</option>
        </select>

        <label>Feedback:</label>
        <textarea name="feedback_message" value={formData.feedback_message} onChange={handleChange} required />

        <button type="submit">Submit Feedback</button>
      </form>

      {status && <p className="status-message">{status}</p>}

      {/* SECTION 2: The Display List */}
      <div className="feedback-list">
        <h2>Recent Feedback</h2>
        {feedbacks.map((item) => (
          <div key={item.id} className="feedback-card">
            <strong>{item.student_name}</strong> (Rating: {item.rating}/5)
            <p>{item.feedback_message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
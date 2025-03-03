// import { useSelector, useDispatch } from 'react-redux';
// import { Card, Button } from 'antd';
// import { removeFavorite } from '../redux/favouriteSlice';

// const Favorites = () => {
//   const favorites = useSelector((state) => state.favorites.savedJobs);
//   const dispatch = useDispatch();

//   return (
//     <div>
//       <h2>Favorite Jobs</h2>
//       {favorites.length === 0 ? <p>No favorites added yet.</p> : (
//         <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
//           {favorites.map((job) => (
//             <Card key={job.id} title={job.title} style={{ width: 300, margin: '10px' }}>
//               <p><strong>Company:</strong> {job.company_name}</p>
//               <p><strong>Type:</strong> {job.job_type}</p>
//               <Button danger onClick={() => dispatch(removeFavorite(job.id))}>Remove</Button>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Favorites;

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Input, Select, Button, Tag,Spin, Row, Col, Typography } from 'antd';
import '../App.css';
import { addFavorite, removeFavorite } from '../redux/favouriteSlice';
import axios from 'axios';
import { StarOutlined, StarFilled } from '@ant-design/icons';


const { Option } = Select;
const { Title, Paragraph } = Typography;

const Favourites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.savedJobs);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [limit, setLimit] = useState(20);
  const [categories, setCategories] = useState([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://remotive.com/api/remote-jobs', {
        params: {
          search: search || undefined,
          category: filterType || undefined,
          limit: limit,
        },
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  console.log("favorites",favorites)
  const isFavorite = (job) => favorites?.some(favJob => favJob.id === job.id);

  const toggleFavorite = (job) => {
    if (isFavorite(job)) {
      dispatch(removeFavorite(job.id));
    } else {
      dispatch(addFavorite(job));
    }
  };



  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://remotive.com/api/remote-jobs/categories');
      setCategories(response.data.jobs);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    fetchJobs();
    fetchCategories();

  }, []);

  
  const handleSearch = () => {
    const newFilteredJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) &&
        (filterType === '' || job.category.toLowerCase() === filterType.toLowerCase())
    );
    setFilteredJobs(newFilteredJobs);
  };

  return (
    <div className="joblistings-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <Title className="hero-title">Find Your Dream Job</Title>
            <Paragraph className="hero-subtitle">
              Explore the latest job opportunities across industries.
            </Paragraph>
          </div>
        </div>
      </div>


      {/* Job Listings */}
      <div style={{textAlign: 'center',padding: '40px' }}>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <Row justify="center" className="job-list">
          {favorites.length > 0 ? (
            favorites.map((job) => (
              <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                <Card className="job-card" hoverable style={{ height: 250, display:'flex',justifyContent:"center",alignItems:"center", margin: '5px 0' }}>
                  <Row style={{width:"100%"}}>
                  <Col xs={24}>
                  {isFavorite(job) ? (
                  <StarFilled  onClick={() => toggleFavorite(job)} style={{ color: 'gold', fontSize: '20px' }} />
                ) : (
                  <StarOutlined  onClick={() => toggleFavorite(job)} style={{ fontSize: '20px' }} />
                )}

                    <Title level={5} style={{ margin: 0 }}>{job.title}</Title>
                   
              
            
                    <Paragraph style={{ margin: 0, color: 'gray' }}>{job.company_name}</Paragraph>

                    {/* Job Tags */}
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">{job.job_type}</Tag>
                      {job.salary && <Tag color="green">💰 {job.salary}</Tag>}
                      {job.candidate_required_location && <Tag color="red">📍 {job.candidate_required_location}</Tag>}
                      <Tag color="purple">📅 {new Date(job.publication_date).toDateString()}</Tag>
                    </div>
                  </Col>
                </Row>
                <br/>
                  <Button type="primary" href={job.url} target="_blank">
                    Apply Now
                  </Button>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} className="no-jobs">
              <Paragraph>No jobs found.</Paragraph>
            </Col>
          )}
        </Row>
      )}
      </div>
     
    </div>
  );
};

export default Favourites;

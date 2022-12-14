import React, { useState } from 'react'
import Posts from '../../components/Posts/Posts';
import Form from '../../components/Form/Form';
import SwiperIntro from '../../components/swiper/SwiperIntro';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, SwipeableDrawer } from '@material-ui/core';

import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Pagination from '../Pagination';
import useStyles from './styles';
import {  getPostsBySearch } from '../../actions/posts';



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(0)
    const dispatch = useDispatch();
    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    


    const searchPost = () => {
      if (search.trim() || tags) {
        dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
        navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
      } else {
        navigate('/');
      }
    };

    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        searchPost();
      }
    };

    const handleAddChip = (tag) => setTags([...tags, tag]);

    const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

return (
    <div> 
    <Grow in>
     
    <Container maxWidth="xl">
      <div className='title-container'>
    <h1> New to Artish ? Get Started with your First Project </h1>
    <h2> Your First Gig awaits</h2>
    </div>
    <SwiperIntro/>
      <Grid container justifyContent="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
        <Grid  item xs={12} sm={6} md={9}>
          <Posts  setCurrentId={setCurrentId}  />
          
          {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
        </Grid>
        <Grid  item xs={12} sm={6} md={3}>
<AppBar className={classes.appBarSearch} position="static" color="inherit">
<TextField className={classes.value} onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search for a Job" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
      <ChipInput
        style={{ margin: '10px 0' }}
        value={tags}
        onAdd={handleAddChip}
        onDelete={ handleDeleteChip}
        label="Search Tags"
        variant="outlined"
      />
        <Button onClick={searchPost} className='btn btn-primary' variant="contained" color="primary">Search</Button>
    </AppBar>
          <Form currentId={currentId} setCurrentId={setCurrentId}  />
        </Grid>
      </Grid>
    </Container>
  </Grow>
  </div>
  )
}

export default Home
"use client"
import { useState , useEffect} from "react"

import PromptCard from "@components/PromptCard"

const PromptCardList = ({data, handleTagClick}) =>{
  return(
    <div className="mt-16 prompt_layout">
      {data.map((post) =>(
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState(""); 
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]); 
  const [posts, setPosts] = useState([])

  const handleSearchChange= (e) =>{
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);


    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    );

  }

  const handleTagClick = (tag) =>{
    console.log(tag); 
    setSearchText(tag); 
    const searchResult = filterPosts(tag);
    setSearchResults(searchResult);
  }

  const fetchPosts = async ()=>{
    const response = await fetch("/api/prompt/");
    const data = await response.json(); 

    setPosts(data); 
  } 


  useEffect(()=>{
    fetchPosts(); 
  }, [])

  const filterPosts = (searchText) =>{
    console.log(posts[0].prompt.includes(searchText)); 
    const searchResults = posts.filter((post) =>( 
      post.prompt.toLowerCase().includes(searchText.toLowerCase()) 
      || post.tag.toLowerCase().includes(searchText.toLowerCase())
      || post.creator.username.toLowerCase().includes(searchText.toLowerCase()) 
      ))

    return searchResults; 

  }
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />

      </form>
      {searchText ? (
        <PromptCardList
        data={searchResults}
        handleTagClick={handleTagClick}
      />
      ):        
      <PromptCardList
      data={posts}
      handleTagClick={handleTagClick}
      />}
    </section >
  )
}

export default Feed

import { useState } from "react";
import ListImg from "./components/ListImg";
import SearchBar from "./components/SearchBar";
import searchImg from "./imgApi";

function App() {
  const [images, setImages] = useState([]);

  const handleKeyword = async (keyword) => {
    const result = await searchImg(keyword);
    setImages(result);
  };

  return (
    <>
      <SearchBar searching={handleKeyword} />
      <ListImg images={images} />
    </>
  );
}

export default App;

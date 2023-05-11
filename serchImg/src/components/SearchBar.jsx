import { useState } from "react";

function SearchBar({ searching }) {
  const [keyword, setKeyword] = useState("");

  const handleInp = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searching(keyword);
  };

  return (
    <nav>
      {/* 버튼에 onClick={handleSubmit} 대신 form에 submit을 쓰면 엔터를 쳤을 때 제출됨 */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="keyword">검색어를 입력하세요.</label>
        <input type="text" id="keyword" value={keyword} onChange={handleInp} />
        <button>검색</button>
      </form>
    </nav>
  );
}

export default SearchBar;

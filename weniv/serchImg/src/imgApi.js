// fetch
// const searchImg = async () => {
//   let json;
//   // 헤더를 읽는 코드
//   const response = await fetch(
//     "https://api.unsplash.com/search/photos?query=flower&client_id=UwKY1jgeOCPktDGkXz1_rY1xw7QbpzniryD-vsUU8jc",
//     {
//       method: "GET",
//     }
//   );
//   // 바디를 읽는 코드
//   if (response.ok) {
//     json = await response.json();
//   } else {
//     alert("http error" + response.status);
//   }

//   console.log(json);
// };

// axios
import axios from "axios";

const searchImg = async (keyword) => {
  const response = await axios
    .get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: "Client-ID UwKY1jgeOCPktDGkXz1_rY1xw7QbpzniryD-vsUU8jc",
      },
      params: {
        query: keyword,
      },
    })
    .catch(function (error) {
      if (error.response) {
        // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 요청이 전송되었지만, 응답이 수신되지 않았습니다.
        // 'error.request'는 브라우저에서 XMLHtpRequest 인스턴스이고,
        // node.js에서는 http.ClientRequest 인스턴스입니다.
        console.log(error.request);
      } else {
        // 오류가 발생한 요청을 설정하는 동안 문제가 발생했습니다.
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

  return response.data.results;
};

export default searchImg;

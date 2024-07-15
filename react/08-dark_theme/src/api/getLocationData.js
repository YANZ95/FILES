import { getXmlToJson } from '../utils/getXmlToJson';

const SERVICE_KEY =
  "SjsCGr3Vuaw2pWMdBog%2F%2BlxX%2BGFkrKfcbAKJ7cyBIb8gLK%2B0eMftpPylIW5BD6LTn3930si9rrJWQdsQ4DZKUA%3D%3D";

function getFormattedDate() {
  // 날짜를 어떤 식으로? 년월일
  // 날짜 객체 만든 다응에 요 형태로 만들면 된다.
  const today = new Date();
  const isoString = today.toISOString(); // 2024-07-15T15:05:35. 575Z -> T를 기준으로 스플릿하면
//   앞에 2024-07-15 나옴
// 20240715 만들기
const formattedDate = isoString.split('T')[0].split('-').join('');
console.log(formattedDate);
return formattedDate;}

async function getSunsetRiseData() {
  var xhr = new XMLHttpRequest();
  var url =
    "http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo"; /*URL*/
  var queryParams =
    "?" + encodeURIComponent("serviceKey") + "=" + SERVICE_KEY; /*Service Key*/
//   // serviceKey -> 한글로 들어오면 깨짐. 깨지지않게 정확하게 할때 encodeURIComponent, 우리는
//   // 문자열로 들어온다 이해하면 됨
  queryParams +=
    "&" +
    encodeURIComponent("locdate") +
    "=" +
    encodeURIComponent(getFormattedDate());   //("20150101"); /**/
  queryParams +=
    "&" +
    encodeURIComponent("location") +
    "=" +

encodeURIComponent('대전'); /**/
const result = await fetch(url + queryParams);
const textResult = await result.text();
console.log(textResult);
const xmlString = new DOMParser().parseFromString(textResult, 'text/xml');
const jsonREsult = getXmlToJson(xmlString);
return jsonResult.response.body.items.item;
}

export { getSunsetRiseData };

// xml이라면 이렇게 써도 됨
// console.log(jsonREsult);
//     encodeURIComponent("대전"); /**/
//   xhr.open("GET", url + queryParams);
//   xhr.onreadystatechange = function () {
//     if (this.readyState == 4) {
//       // 통신 성공했을 때가 4
//       console.log();
//       alert(
//         "Status: " +
//           // 성공 유무
//           this.status +
//           "nHeaders: " +
//           JSON.stringify(this.getAllResponseHeaders()) +
//           // JSON.stringify -> 객체를 문자열로, 응답을 보여주겠다는 뜻
//           "nBody: " +
//           this.responseText
//       );
//       const jsonResult = 
//     }
//   };
// }

// export {getSunsetRiseData};

// xhr.send("");
// 통신을 하겠다
return jsonREsult.response,body,items.items;
}


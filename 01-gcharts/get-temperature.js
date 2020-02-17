// 기상청 사이트의 RSS부터 JSON파일을 출력하기

// RSS 주소 ----- (※1)
var RSS = "http://web.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109";
var SAVE_PATH = "temperature-data.js";

// 모듈을 읽어 들임
var client = require('cheerio-httpcli');
var fs = require('fs');

// RSS 다운로드----- (※2)
client.fetch(RSS, {}, function(err, $, res) {
  if (err) { console.log("error"); return; }
  
// 필요한 항목을 추출하여 표시
  var res = [];
$("location:nth-child(1) > data").each(function(idx) { //1은 서울.경기 
    var tmEf = $(this).find('tmEf').text();
    if(tmEf.match('00:00'))
    {
      var tmn = $(this).find('tmn').text(); //tmn 태그값 찾아서 넣고 
      var tmx = $(this).find('tmx').text();
      var line = [tmEf, parseInt(tmx), parseInt(tmn)]; // 뒤에 둘은 숫자로 바꿔서 넣고
      res.push(line); // 배열에 푸쉬
      console.log(line);
    }
  });
  
  // 저장하기 ---- (※4)
  res.unshift(['날짜','최고기온','최저기온']); // 앞에 추가
  var src = "var tempData = " + JSON.stringify(res);
  fs.writeFileSync(SAVE_PATH, src, "utf-8");
  console.log("ok!");
});
$(document).ready(function () {
  //페이지 로딩시 호출할 함수
  listing();
});

function listing() {
  //페이지 로딩이 완료되면
  fetch("/popular/") // 리스트 함수 호출
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#cards-box").empty();
      rows.forEach((a) => {
        let restaurant_name = a["restaurant_name"]; //제목
        let comment = a["comment"]; //내용
        let road_address = a["road_address"]; //카테고리(지역)

        let temp_html = `
              <div class="col">
                  <div class="card h-100">
                      <a href="" >
                          
                      </a>
                      <div class="card-body">
                          <a href="" style="text-decoration: none;">
                          <h5 class="card-title">${restaurant_name}</h5>
                          <p>${road_address} </p>
                          <p class="card-text"> ${comment}</p>
                          </a>
                      </div>
                  </div>
              </div>
                              `;

        $("#cards-box").append(temp_html);
      });
    });
}

// ============================카테고리 선택 시 리스트 ============================
const region_tags = {
  seoul: "서울",
  incheon: "인천",
  busan: "부산",
  daegu: "대구",
  gwangju: "광주",
  daejeon: "대전",
  ulsan: "울산",
  gyeonggi: "경기",
  gangwon: "강원",
  chungbuk: "충북", // n-chungcheong으로 하게 되면 key 값이 n-chungcheong이 아니라 "n-chungcheong"이 되어, 일관성을 위해 이름을 조금 바꿨습니다.
  chungnam: "충남",
  jeonbuk: "전북",
  jeonnam: "전남",
  gyeongbuk: "경북",
  gyeongnmam: "경남",
  jeju: "제주",
};

const changeValue = (target) => {
  //  <select onchange="changeValue(this)">
  // 선택한 option의 value 값
  let region_tag_ko = region_tags[target.value];
  console.log(region_tag_ko);

  const formData = new FormData();
  formData.append("region_tag_ko", region_tag_ko);

  fetch(`/popular/sorted`, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#cards-box").empty();
      // list 꺼내기
      rows.forEach((a) => {
        let restaurant_name = a["restaurant_name"]; //제목
        let comment = a["comment"]; //내용
        let road_address = a["road_address"]; //카테고리(지역)

        console.log("title");
        let temp_html = `
        <div class="col">
            <div class="card h-100">
                <a href="" >
                </a>
                <div class="card-body">
                    <a href="" style="text-decoration: none;">
                    <h5 class="card-title">${restaurant_name}</h5>
                    <p>${road_address} </p>
                    <p class="card-text"> ${comment}</p>
                    </a>
                </div>
            </div>
        </div>
                        `;
        $("#cards-box").append(temp_html);
      });
    });
};

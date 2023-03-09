// ============================ 페이지 로딩시 호출할 함수 ============================

$(document).ready(function () {
  listing();
});

// ============================ 홈 화면 전체 리스트 ============================

function listing() {
  fetch("/popular/")
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
                          <a href='javascript:void(0);' onclick="click_card('${restaurant_name}','${road_address}');">
                            <div class="card-body">
                              <h5 class="card-title">${restaurant_name}</h5>
                              <p>${road_address} </p>
                              <p class="card-text"> ${comment}</p>
                            </div>
                          </a>
                        </div>
                      </div>
                                `;

        $("#cards-box").append(temp_html);
      });
    });
}

// ============================카테고리 선택 시 리스트 ============================
// 조회하기 버튼을 클릭했을 때가 아니라 select를 선택했을 때 바로 반영
// select값에 onchange 속성 넣어주시면 됩니다. option의 value 값에 따라 작동
// 또한 select에 value 값이 없는 전체보기 옵션 추가 필요

const region_tags = {
  all: "",
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

        let temp_html = `
                  <div class="col">
                    <div class="card h-100">
                      <a href='javascript:void(0);' onclick="click_card('${restaurant_name}','${road_address}');">
                        <div class="card-body">
                          <h5 class="card-title">${restaurant_name}</h5>
                          <p>${road_address} </p>
                          <p class="card-text"> ${comment}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                          
                `;
        $("#cards-box").append(temp_html);
      });
    });
};

function click_card(name, road_address) {
  var name_selected = name;
  var address_selected = road_address;
  // return restaurant_name_selected
  // console.log(name_selected,address_selected)
  const formData = new FormData();
  formData.append("address", address_selected);

  fetch("/move_detail", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#cards-box").empty();
      // list 꺼내기
      rows.forEach((a) => {
        let restaurant_name = a["restaurant_name"]; //제목
        let road_address = a["road_address"];
        let jibun_address = a["jibun_address"];
        let detail_address = a["detail_address"];
        let extra_address = a["extra_address"];
        let nickname = a["nickname"];
        let comment = a["comment"]; //내용
        let rating = a["rating"];
        let star_repeat = "⭐".repeat(rating);

        console.log("title");
        let temp_html = `
        <div class="card h-100">
                    <div class="card-body">
                    <h5 class="card-title">${restaurant_name}</h5>
                    <div>
                        주소 <br>${road_address} 
                        <br> ${jibun_address}
                        <br> ${detail_address}
                        </div>
                    <p class="card-text"> 리뷰 <br>${comment}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li id="star" class="list-group-item">별점: ${star_repeat}</li>
                        <li id="nickname" class="list-group-item">닉네임: ${nickname}</li>
                    </ul>
                    </div>
                 `;
        $("#cards-box").append(temp_html);
      });
    });
}

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
        let road_address = a["road_address"]; 
        let nickname = a["nickname"];
        let temp_html = `
                      <div class="col">
                        <div class="card h-100">
                          <a href='javascript:void(0);' onclick="click_card('${restaurant_name}','${road_address}');">
                            <img src="https://placehold.co/600x400?text=Image" class="card-img-top" alt="image"/>
                              <div class="card-body">
                                  <h5 class="card-title">${restaurant_name}</h5>
                                  <p class="card-text"> ${comment}</p>
                                  <p>글쓴이: ${nickname}</p>
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
  chungbuk: "충북", 
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
        let road_address = a["road_address"]; 
        let nickname = a["nickname"];
        let temp_html = `
            <div class="col">
              <div class="card h-100">
                <a href='javascript:void(0);' onclick="click_card('${restaurant_name}','${road_address}');">
                  <img src="https://placehold.co/600x400?text=Image" class="card-img-top" alt="image"/>
                    <div class="card-body">
                        <h5 class="card-title">${restaurant_name}</h5>
                        <p class="card-text"> ${comment}</p>
                        <p>글쓴이: ${nickname}</p>
                    </div>
                </a>
              </div>
            </div> 
                `;
        $("#cards-box").append(temp_html);
      });
    });
};



// ============================ 상세페이지 ============================

// ------------ (3.9 추가) 삭제하기 버튼------------
function click_card(name, road_address) {
  var name_selected = name;
  var address_selected = road_address;

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

        let temp_html = `
        <div id = "detail_page">
        <h5 class="detail-title">${restaurant_name}</h5>
          <div id = "detail-body">
            <div class="rating">${star_repeat} </div>
            <div class="comment"> ${comment}</div>
            <ul id ="info">
              <li class = "address">
                ${road_address} ${detail_address}
              </li> 
              <li class = "nickname">글쓴이: ${nickname}</li>
              <li>
                <form id = "delete-form">
                  <button id="del_button" class="btn btn-outline-secondary" onclick="delete_card ('${restaurant_name}','${road_address}')" >삭제하기</button>
                </form>
              </li>
            </ul>

          </div>
          <div class="maps">
            <div id="map" style="width:100%;height:350px;"></div>
            <p style="font-size:13px; margin-top:5px; text-align: right;">
              <em class="link">
                  <a href="javascript:void(0);" onclick="window.open('http://fiy.daum.net/fiy/map/CsGeneral.daum', '_blank', 'width=981, height=650')">
                      결과 오류 제보하기
                  </a>
              </em>
            </p>
          </div>

          <script>
            var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
                center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                level: 3
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);
            
            var geocoder = new kakao.maps.services.Geocoder();
            
            geocoder.addressSearch('${road_address}', function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">${restaurant_name}</div>'
                });
                infowindow.open(map, marker);
        
                map.setCenter(coords);
              }
            });    
          </script>
          
                 `;
        $("#cards-box").append(temp_html);
      });
    });
}

//------------(3.9 추가) 삭제하기 버튼 함수------------


function delete_card (name, road_address) {
  var name_selected = name;
  var address_selected = road_address;
  // return restaurant_name_selected
  // console.log(name_selected,address_selected)
  const formData = new FormData();
  formData.append("address", address_selected);

  fetch("/delete", { method: "POST", body: formData })
  .then((res) => res.json())
  .then((data) => {
    alert(data["msg"]);
  });

};


// ============================ 상세페이지 끝 ============================
$(document).ready(function () { //페이지 로딩시 호출할 함수
    listing();
});

// ============================카테고리 선택 시 리스트 ============================
function listing() { //페이지 로딩이 완료되면
    fetch('/popular/') // 리스트 함수 호출
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            $('#cards-box').empty()
            rows.forEach((a) => {
                let restaurant_name = a['restaurant_name'] //제목
                let comment = a['comment'] //내용
                let road_address = a['road_address'] //카테고리(지역)

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
                              `

                $('#cards-box').append(temp_html);
            })
        })
}



// ============================카테고리 선택 시 리스트 ============================
// 버튼을 클릭했을 때가 아니라 select를 선택했을 때 바로 반영
//select값에 onchange 속성 넣어주시면 됩니다. option의 value 값에 따라 작동
// 또한 select에 value 값이 없는 전체보기 옵션 추가 필요

const changeValue = (target) => { //  <select onchange="changeValue(this)">
    // 선택한 option의 value 값
    let tag_name = target.value;

    fetch(`/popular/${tag_name}`)
        .then((res) => res.json())
        .then((data) => {
            let rows = data['result']
            $('#cards-box').empty()
            // list 꺼내기
            rows.forEach((a) => {
                let restaurant_name = a['restaurant_name'] //제목
                let comment = a['comment'] //내용
                let road_address = a['road_address'] //카테고리(지역)

                console.log('title')
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
                          `
                $('#cards-box').append(temp_html);
            })
        })

}
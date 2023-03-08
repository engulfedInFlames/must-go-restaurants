// 카드 누르면 본문 보이기

function click_card(name, road_address) {
    var name_selected = name;
    var address_selected = road_address;
    // return restaurant_name_selected
    // console.log(name_selected,address_selected)
    const formData = new FormData();
    formData.append("address", address_selected);
    
    fetch('/move_detail', { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        let rows = data["result"];
        $("#cards").empty();
        // list 꺼내기
        rows.forEach((a) => {
          let restaurant_name = a["restaurant_name"]; //제목
          let road_address = a["road_address"]
          let jibun_address = a["jibun_address"]
          let detail_address = a["detail_address"]
          let extra_address = a["extra_address"]
          let nickname = a["nickname"]
          let comment = a["comment"]; //내용
          let rating = a["rating"]

          console.log("title");
          let temp_html = `
                      <div class="card-body">
                      <h5 class="card-title">${restaurant_name}</h5>
                      <div>
                          ${road_address} 
                          <br> ${jibun_address}
                          <br> ${detail_address}
                          </div>
                      <p class="card-text">${comment}</p>
                      </div>
                      <ul class="list-group list-group-flush">
                          <li id="star" class="list-group-item">⭐⭐⭐</li>
                          <li id="nickname" class="list-group-item">${nickname}</li>
                      </ul>
                   `;
          $("#cards").append(temp_html);
        });
      });


  }
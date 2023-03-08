$(document).ready(function () {
  listing();
});

function listing() { //페이지 로딩이 완료되면
  fetch('/detail')
    .then((res) => res.json())
    .then((data) => {
      let rows = data['result']
      console.log(rows)
      let restaurant_name = rows.restaurant_name
      let comment = rows.comment
      let nickname = rows.nickname

      // 값이 여러개 들어오는 게 아니라서 forEach는 뺐습니다!!
      let temp_html = `
          <div class="card-body">
          <h5 class="card-title">${restaurant_name}</h5>
          <p class="card-text">${comment}</p>
          </div>
          <ul class="list-group list-group-flush">
              <li id="star" class="list-group-item">⭐⭐⭐</li>
              <li id="nickname" class="list-group-item">${nickname}</li>
          </ul>
          `
      $('#cards-box').append(temp_html);
    })

}
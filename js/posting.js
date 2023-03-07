// 글쓰기 페이지 --> DB에 글 저장하기

function submitting() { // button onclick
    let restaurant_name = $('#restaurantNameInput').val();
    let postcode = $('#sample4_postcode').val();
    let roadAddress = $('#sample4_roadAddress').val();
    let jibunAddress = $('#sample4_jibunAddress').val();
    let detailAddress = $('#sample4_detailAddress').val();
    let extraAddress = $('#sample4_extraAddress').val();
    let nickname = $('#nicknameInput').val();
    let comment = $('#commentInput').val();
    let rating = $('#rating').val();

    let formData = new FormData();

    formData.append("restaurant_name_give", restaurant_name);
    formData.append("postcode_give", postcode);
    formData.append("road_address_give", roadAddress);
    formData.append("jibun_address_give", jibunAddress);
    formData.append("detail_address_give", detailAddress);
    formData.append("extra_address_give", extraAddress);
    formData.append("nickname_give", nickname);
    formData.append("comment_give", comment);
    formData.append("rating_give", rating);



    fetch('/save-review', {
        method: "POST", body: formData
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data["msg"]);
            window.location.reload();
        });
}
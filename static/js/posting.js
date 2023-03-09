// 주소 찾기 서비스를 위해 다음 주소 API를 가지고 온 것입니다.
function sample4_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var roadAddr = data.roadAddress; // 도로명 주소 변수
      var extraRoadAddr = ""; // 참고 항목 변수

      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== "" && data.apartment === "Y") {
        extraRoadAddr +=
          extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName;
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraRoadAddr !== "") {
        extraRoadAddr = " (" + extraRoadAddr + ")";
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("sample4_postcode").value = data.zonecode;
      document.getElementById("sample4_roadAddress").value = roadAddr;
      document.getElementById("sample4_jibunAddress").value = data.jibunAddress;

      // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
      if (roadAddr !== "") {
        document.getElementById("sample4_extraAddress").value = extraRoadAddr;
      } else {
        document.getElementById("sample4_extraAddress").value = "";
      }

      var guideTextBox = document.getElementById("guide");
      // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
      if (data.autoRoadAddress) {
        var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
        guideTextBox.innerHTML = "(예상 도로명 주소 : " + expRoadAddr + ")";
        guideTextBox.style.display = "block";
      } else if (data.autoJibunAddress) {
        var expJibunAddr = data.autoJibunAddress;
        guideTextBox.innerHTML = "(예상 지번 주소 : " + expJibunAddr + ")";
        guideTextBox.style.display = "block";
      } else {
        guideTextBox.innerHTML = "";
        guideTextBox.style.display = "none";
      }
    },
  }).open();
}

/////////////////////////////////////////////////////////////////////////////////
const myForm = document.querySelector(".my-form");
const cancelBtn = document.getElementById("cancelBtn");

function onClickSubmit() {
  // 유저가 등록한 이미지 파일들을 읽어들이는 코드를 추가할 예정입니다. 확인을 위해 나머지 코드들은 주석 처리를 해놨습니다.

  let restaurant_name = $("#restaurantNameInput").val();
  let postcode = $("#sample4_postcode").val();
  let roadAddress = $("#sample4_roadAddress").val();
  let jibunAddress = $("#sample4_jibunAddress").val();
  let detailAddress = $("#sample4_detailAddress").val();
  let extraAddress = $("#sample4_extraAddress").val();
  let nickname = $("#nicknameInput").val();
  let comment = $("#commentInput").val();
  let rating = $("#rating").val();

  if (!nickname) {
    nickname = "익명";
  }
  if (!comment) {
    comment = "";
  }

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

  fetch("/save-review", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data["msg"]);
    });
}

// Form Event를 다루기 위한 함수
function onClickSubmitBtn(event) {
  // 기본적으로 Form은 Submit 되면, 새로고침되어 해당 페이지를 다시 보여줍니다. 즉, 새로고침이 Form의 기본 event입니다.
  // "등록"이나 "취소" 버튼을 눌러, 홈으로 이동하게끔 하려면 새로고침되는 것을 막아야 하는데, 이때 event.preventDefault()가 기본 event의 작동을 막습니다. 즉, 새로고침되지 않습니다.
  // 새로고침되지 않게 설정한 뒤에, 서버로 유저가 작성한 데이터를 보내주고, 홈으로 가는 코드를 작성하여, 버튼이 의도대로 기능하게 바꿨습니다.
  event.preventDefault();

  if (event.submitter.id === "submitBtn") {
    // console.log("Submitted");
    onClickSubmit();
  }
  // (window.)location은 url 정보를 조작할 수 있습니다.
  window.location.replace(window.location.origin);
}

function onClickCancelBtn() {
  window.location.replace(window.location.origin);
}

myForm.addEventListener("submit", onClickSubmitBtn);
cancelBtn.addEventListener("click", onClickCancelBtn);
/////////////////////////////////////////////////////////////////////////////////

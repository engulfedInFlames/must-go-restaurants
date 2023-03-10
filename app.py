from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('mongodb+srv://sparta:test@cluster0.q4j284y.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
 
@app.route('/')
def home():
    return render_template('index.html')

# ============================= 글 목록 =============================
# 홈 화면에서는 식당 이름,사진,코멘트,닉네임

@app.route('/home')
def gohome():
    return render_template('index.html')

@app.route("/popular/", methods=["GET"])
def review_get():
    all_reviews = list(db.restaurant.find({},{'_id':False})) # DB에서 파일 전부 가져오기
    return jsonify({'result':all_reviews})

# ===================== 카테고리 불러오기 시작 =======================
 
@app.route("/popular/sorted", methods=["POST"])
def review_sorted_get(): # 옵션값이 전체일때
    if request.form["region_tag_ko"] == "":
        reviews_category = list(db.restaurant.find({},{'_id':False}))
        return jsonify({"result":reviews_category})
    region_tag_ko = request.form["region_tag_ko"]
    reviews_category = list(db.restaurant.find({'tag':region_tag_ko},{'_id':False}))
    return jsonify({"result":reviews_category})

# ============================= 글 작성 =============================
# ""글작성 버튼"" 눌렀을 때 ---> 작성하기 페이지로 넘어가는 코드입니다. 버튼 혹은 글 링크 안에 이 함수 이름 넣어주시면 됩니다.
# 예시) <a href="{{url_for('write_func')}}">글쓰기</a> 
# 임시))) 글작성 페이지 파일 이름 : writepg.html
   
@app.route("/write") 
def write_func():
    return render_template("posting.html", title="글쓰기")

# 작성한 글 저장하기 --> POST id="submitBtn" event
@app.route("/save-review", methods=["POST"])
def save_review():
    restaurant_name_receive = request.form['restaurant_name_give'] # 가게이름
    image_url_receive = request.form['image_url_give']
    postcode_receive = request.form['postcode_give'] # 우편번호 
    road_address_receive = request.form['road_address_give'] #도로명주소
    jibun_address_receive = request.form['jibun_address_give'] #지번주소
    detail_address_receive = request.form['detail_address_give'] #상세주소
    extra_address_receive = request.form['extra_address_give']  #참고항목
    nickname_receive = request.form['nickname_give'] #닉네임
    comment_receive = request.form['comment_give']  #코멘트
    rating_receive = request.form['rating_give'] #별점
    
    # 카테고리 검색 위한 태그
    address_spl = road_address_receive.split() # 도로명주소 단어로 나누기
    address_tag = address_spl[0] # 나눈 리스트의 첫번째
    
    #DB저장
    doc = {
        'restaurant_name' : restaurant_name_receive,
        'image_url': image_url_receive,
        'postcode' : postcode_receive,
        'road_address' : road_address_receive,
        'jibun_address' : jibun_address_receive,
        'detail_address' : detail_address_receive,
        'extra_address' : extra_address_receive,
        'nickname' : nickname_receive,
        'comment' : comment_receive,
        'rating' : rating_receive,
        'tag' : address_tag 
    }
    db.restaurant.insert_one(doc)
    return jsonify({'msg': '저장되었습니다.'})
    
# ============================= 글 조회 =============================
@app.route("/move_detail",methods=["POST"]) # 글 링크 누르면 상세페이지로 이동
def move_detail():
    address = request.form["address"]
    aaaa= list(db.restaurant.find({'road_address':address},{'_id':False}))
    return jsonify({"result":aaaa})


# ============================= 글 삭제 ============================= 

@app.route("/delete",methods=["POST"]) # 글 링크 누르면 상세페이지로 이동
def delete_card():
    address = request.form["address"]
    
    db.restaurant.delete_one({'road_address':address})
    return jsonify({'msg': '삭제되었습니다.'})   
    



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
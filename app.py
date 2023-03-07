from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# DB연결
from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.q4j284y.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
 
@app.route('/')
def home():
    return render_template('index.html')


# topics = list(db.restaurant.find({})) # 글 조회 시 사용할 딕셔너리

# 글 조회 --> POST
# @app.route("/write") 

        

# 글작성 페이지 html 이름이 writepg.html이라면 --> GET
@app.route("/write") 
def write_func():
    return render_template("writepg.html", title="글쓰기")


# 작성한 글 저장하기 --> POST
@app.route("/save-review", methods=["POST"])
def save_review():
    restaurant_name_receive = request.form['restaurant_name_give'] # 가게이름
    postcode_receive = request.form['postcode_give'] # 우편번호 
    road_address_receive = request.form['road_address_give']    #도로명주소
    jibun_address_receive = request.form['jibun_address_give']  #지번주소
    detail_address_receive = request.form['detail_address_give']    #상세주소
    extra_address_receive = request.form['extra_address_give']  #참고항목
    nickname_receive = request.form['nickname_give']    #닉네임
    comment_receive = request.form['comment_give']  #코멘트
    rating_receive = request.form['rating_give']    #별점



    #DB저장
    doc = {
        'restaurant_name' : restaurant_name_receive,
        'postcode' : postcode_receive,
        'road_address' : road_address_receive,
        'jibun_address' : jibun_address_receive,
        'detail_address' : detail_address_receive,
        'extra_address' : extra_address_receive,
        'nickname' : nickname_receive,
        'comment' : comment_receive,
        'rating' : rating_receive
    }
    db.restaurant.insert_one(doc)

    return jsonify({'msg': '저장되었습니다.'})
    


# main(홈) - 전체 목록
@app.route("/popular", methods=["GET"])
def review_get():
    all_reviews = list(db.restaurant.find({},{'_id':False})) # DB에서 파일 전부 가져오기
    return jsonify({'result':all_reviews})


# 카테고리 불러오기

# 카테고리 - 서울
@app.route("/popular/seoul", methods=["GET"])
def review_seoul_get():
    reviews_category = list(db.restaurant.find({'region':'서울'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
    return jsonify({'result':reviews_category})
 






if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)




from flask import Flask, abort, redirect, render_template, request, jsonify, url_for
from bson.objectid import ObjectId

app = Flask(__name__)


# DB연결
from pymongo import MongoClient
client = MongoClient('mongodb+srv://sparta:test@cluster0.q4j284y.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
 
@app.route('/')
def home():
    return render_template('index.html')


# ============================= 글 목록 =============================
@app.route('/home')
def gohome():
    return render_template('index.html')


# main(홈) - 전체 목록
# 목록(카드형)에 상세페이지로 가는 링크 필요 / 주소 가게 이름 사진만 나오는 걸로
@app.route("/popular/", methods=["GET"])
def review_get():
    all_reviews = list(db.restaurant.find({},{'_id':False})) # 3.8 변경사항 -- id값도 가져오게 함 (상세페이지)
    return jsonify({'result':all_reviews})


# ===================== 카테고리 불러오기=======================

@app.route("/popular/sorted", methods=["POST"])
def review_sorted_get(): # 옵션값이 전체일때
    if request.form["region_tag_ko"] == "":
        reviews_category = list(db.restaurant.find({},{'_id':False}))
        return jsonify({"result":reviews_category})
    else:
        region_tag_ko = request.form["region_tag_ko"]
        reviews_category = list(db.restaurant.find({'tag':region_tag_ko},{'_id':False}))
        return jsonify({"result":reviews_category})



# ============================= 글 작성 =============================

# ""글작성 버튼"" 눌렀을 때 ---> 작성하기 페이지로 넘어가는 코드입니다. 
# 버튼 혹은 글 링크 안에 a href="{{url_for('write_func')}}" 넣어주시면 됩니다.
# 임시))) 글작성 페이지 파일 이름 : posting.html
@app.route("/write") # --> GET 
def write_func():
    return render_template("posting.html", title="글쓰기")

# 작성한 글 저장하기 : ""등록버튼"" 눌렀을 때 --> id="submitBtn" event
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

    # 카테고리 검색 위한 태그
    address_spl = road_address_receive.split() # 도로명주소 단어로 나누기
    address_tag = address_spl[0] # 나눈 리스트의 첫번째
    
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
        'rating' : rating_receive,
        'tag' : address_tag 
    }
    doc_post = db.restaurant.insert_one(doc)

    # return redirect(url_for("read",idx = doc_post.inserted_id))
    # idx = doc_post.inserted_id # 저장된 데이터의 ObjectId 값
    return jsonify({'msg': '저장되었습니다.'})
   
    



# ============================= 글 조회 =============================


@app.route("/move_detail",methods=["POST"]) # 글 링크 누르면 상세페이지로 이동
def move_detail():
    address = request.form["address"]
    aaaa= list(db.restaurant.find({'road_address':address},{'_id':False}))
    return jsonify({"result":aaaa})
    # return render_template("read.html")

# (3.8) 우선 임시로 가게이름 값 넣어두었습니다.
# @app.route("/detail") 
# def detail():
#     dr = db.restaurant.find_one({'restaurant_name':'SADDLER HAUS'},{'_id':False}) 
#     print('----------',dr)
#     return jsonify({'result':dr})



# @app.route("/read_select")
# def read_select():
#     selected_reviews = list(db.restaurant.find({'restaurant_name':"가게이름"},{'_id':False})) # DB에서 원하는 파일 가져오기
#     return jsonify({'result':selected_reviews})
    
    
    
    
    # if request.args.get("idx"):
    #     idx = request.args.get("idx")
    #     # my_db = db.restaurant
    #     if db.restaurant.find_one({"_id":ObjectId(idx)}):
    #         restaurant_data = db.restaurant.find_one({"_id":ObjectId(idx)})
    #         if restaurant_data != "":
    #             db_data = {
    #                 "restaurant_name" : restaurant_data.get("restaurant_name"),
    #                 "road_address" : restaurant_data.get("road_address"),
    #                 "comment" : restaurant_data.get("comment"),
    #                 "nickname" : restaurant_data.get("nickname"),
    #                 "rating" : restaurant_data.get("rating")

    #             }
    #             return render_template('read.html', db_data = db_data)
    #     return abort(404)
    # return abort(404)



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)





# # 1 카테고리 - 서울
# @app.route("/popular/seoul", methods=["GET"])
# def review_seoul_get():
#     reviews_category = list(db.restaurant.find({'tag':'서울'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
#  # 2 카테고리 - 인천
# @app.route("/popular/incheon", methods=["GET"])
# def review_incheon_get():
#     reviews_category = list(db.restaurant.find({'tag':'인천'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
#  # 3 카테고리 - 부산
# @app.route("/popular/busan", methods=["GET"])
# def review_busan_get():
#     reviews_category = list(db.restaurant.find({'tag':'부산'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
# # 4 카테고리 - 대구
# @app.route("/popular/daegu", methods=["GET"])
# def review_daegu_get():
#     reviews_category = list(db.restaurant.find({'tag':'대구'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 5 카테고리 - 광주
# @app.route("/popular/gwangju", methods=["GET"])
# def review_gwangju_get():
#     reviews_category = list(db.restaurant.find({'tag':'광주'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
#  # 6 카테고리 - 대전
# @app.route("/popular/daejeon", methods=["GET"])
# def review_daejeon_get():
#     reviews_category = list(db.restaurant.find({'tag':'대전'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
# # 7 카테고리 - 울산
# @app.route("/popular/ulsan", methods=["GET"])
# def review_ulsan_get():
#     reviews_category = list(db.restaurant.find({'tag':'울산'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
# # 8 카테고리 - 경기
# @app.route("/popular/gyeonggido", methods=["GET"])
# def review_gyeonggi_get():
#     reviews_category = list(db.restaurant.find({'tag':'경기'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
# # 9 카테고리 - 강원
# @app.route("/popular/gangwondo", methods=["GET"])
# def review_gangwon_get():
#     reviews_category = list(db.restaurant.find({'tag':'강원'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 10 카테고리 - 충북
# @app.route("/popular/n-chungcheong", methods=["GET"])
# def review_Nchungcheong_get():
#     reviews_category = list(db.restaurant.find({'tag':'충북'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 11 카테고리 - 충남
# @app.route("/popular/s-chungcheong", methods=["GET"])
# def review_Schungcheong_get():
#     reviews_category = list(db.restaurant.find({'tag':'충남'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 12 카테고리 - 전북
# @app.route("/popular/n-jeolla", methods=["GET"])
# def review_Njeolla_get():
#     reviews_category = list(db.restaurant.find({'tag':'전북'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 13 카테고리 - 전남
# @app.route("/popular/s-jeolla", methods=["GET"])
# def review_Sjeolla_get():
#     reviews_category = list(db.restaurant.find({'tag':'전남'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 14 카테고리 - 경북
# @app.route("/popular/n-gyeongsang", methods=["GET"])
# def review_Ngyeongsang_get():
#     reviews_category = list(db.restaurant.find({'tag':'경북'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})

# # 15 카테고리 - 경남
# @app.route("/popular/s-gyeongsang", methods=["GET"])
# def review_Sgyeongsang_get():
#     reviews_category = list(db.restaurant.find({'tag':'경남'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})
 
# # 16 카테고리 - 제주특별자치도
# @app.route("/popular/jeju", methods=["GET"])
# def review_jeju_get():
#     reviews_category = list(db.restaurant.find({'tag':'제주특별자치도'},{'_id':False})) # DB에서 해당 카테고리의 파일 가져오기
#     return jsonify({'result':reviews_category})


# # ===================== 카테고리 불러오기 끝 =======================





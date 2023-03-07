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
    title_receive = request.form['title_give']
    contents_receive = request.form['contents_give']
    region_receive = request.form['region_give']

    #DB저장
    doc = {
        'title' : title_receive,
        'contents' : contents_receive,
        'region' : region_receive
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




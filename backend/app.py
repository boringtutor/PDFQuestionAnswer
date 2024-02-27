from flask import Flask


app = Flask(__name__)
@app.route('/')
def hello_geek():
    return '<h1>nextjs backend is ready</h2>'


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=int("3000"),debug=True)
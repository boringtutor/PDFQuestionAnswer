from flask import Flask, request, jsonify, make_response

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/')
def hello_geek():
    return '<h1>nextjs backend is ready</h2>'


@app.route('/questionanswer',methods=['POST','GET'])
def questionanswerQuery():
    if request.method == 'POST':
        data = request.json
        if data:
            print('printing data......')
            print(data)
            extractedText = data.get('data').get('extractedText')
            print('printing extractedText......')
            print(extractedText)
            result = f"Question: {extractedText} Answer: This is the answer to the question"
            return jsonify({'message': result}),200
        else:
            return jsonify({'error': 'No JSON data provided'}), 400

        
        
        
    return '<h1>Flask did not get the data </h2>'


if __name__ == "__main__":

    app.run(host="0.0.0.0",port=int("3000"),debug=True)
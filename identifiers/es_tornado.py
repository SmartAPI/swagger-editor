from tornado import httpserver
from tornado.ioloop import IOLoop
import tornado.web
import requests
import json
from tornado.escape import json_encode


class BaseHandler(tornado.web.RequestHandler):
    def return_json(self, data):
        _json_data = json.dumps(data, indent=2)
        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.support_cors()
        self.write(_json_data)

    def support_cors(self, *args, **kwargs):
        '''Provide server side support for CORS request.'''
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control")
        self.set_header("Access-Control-Allow-Credentials", "false")
        self.set_header("Access-Control-Max-Age", "60")

    def options(self, *args, **kwargs):
        self.support_cors()


class SearchHandler(BaseHandler):
    
    
    def get(self):
        query_string = self.get_argument('q')
        url = 'http://localhost:9200/identifiersorg/miriams/_search'
        query = {
            "query": {
                "multi_match": {
                    "fields": ["id", "name", "pattern", "definition", "prefix", "url", "synonyms"],
                    "query": query_string,
                    "type": "cross_fields",
                    "use_dis_max": False
                }
            },
            "size": 100
        }
        resp = requests.post(url, data=json.dumps(query))
        data = resp.json()
        miriams = []
        for hit in data['hits']['hits']:
            miriam = hit['_source']
            miriam['id'] = hit['_id']
            miriams.append(miriam)
        self.return_json(miriams)   
        
        
class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/api/v1/search/?", SearchHandler)
        ]
        tornado.web.Application.__init__(self, handlers)


def main():
    app = Application()
    app.listen(5000)
    IOLoop.instance().start()

if __name__ == '__main__':
    main()
    
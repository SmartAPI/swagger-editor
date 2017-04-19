
.PHONY=help
help::
	@echo "Install virtualenv and dependencies first (see README)"
	@echo ""
	@echo "Then run:"
	@echo "make index #(re)create Elasticsearch index"
	@echo "make backend #Run backend service on http://localhost:5000"
	@echo


.PHONY=backend
backend::
	python es_tornado.py &

.PHONY=index
index::
	curl -XDELETE http://localhost:9200/identifiersorg; echo;
	curl -XPOST http://localhost:9200/identifiersorg -d @mapping.json; echo
	curl -XPOST http://localhost:9200/_bulk --data-binary @miriams.data; echo



# url="http://localhost:8080/ipfs/"
url="http://localhost:3000/"

publish: build
	@export hash=$(shell ipfs add -r -q . | tail -n1) && \
		echo $$hash >>all-versions && \
		echo $$hash >latest-version && \
		xdg-open $(url)

build: app.js

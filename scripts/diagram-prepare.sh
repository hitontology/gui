
#!/bin/bash

# download the SVG image to img/diagram.svg
wget https://hitontology.eu/public/2024-03-hito_diagram.svg -O img/diagram.svg

# Preprocessing
# 1. x,y,height,width 5.831902424 -> 5.0
# 2. arrow head/body declaration
# 3. hyperlinks to ids, remove links
# 4+5. viewport
# 6. minify (remove new lines + spaces at line start)
sed -i -z -r \
	-e 's/([xyth]\="[0-9]+)\.[0-9]+/\1.0/g' \
	-e 's/(<path fill="none" d="[0-9A-Z. ]* L)[0-9.]+ [0-9.]+"(\/>[\r\n]+[[:blank:]]*<path )(d="M)([0-9.]+ [0-9.]+)/\1\4" class="arrow-body" \2class="arrow-head" \3\4/g' \
	-e 's/<g id="y\.(node|edge)\.[0-9]{1,2}">[\r\n]+[[:blank:]]*<a target="_blank" xlink:type="simple" xlink:href="(https:\/\/hitontology.eu\/ontology\/)*([A-Za-z]+)" xlink:show="[a-zA-Z]+">[\r\n]+([0-9A-Za-z \t-.":(),<>=\r\n\/]+)([\r\n]+)[[:blank:]]+<\/a>/<g id="\3">\5\4/g' \
	-e 's/width="([0-9]+)"([a-zA-Z0-9"'"'"' -=]+) height="([0-9]+)"/\2 viewbox="0 0 \1 \3" width="100%"/1' \
	-e 's/id="genericDefs"/id="genericDefs" y="5"/1' \
	-e 's/[\r\n]+[[:blank:]]*//g' \
	img/diagram.svg
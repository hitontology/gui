<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xpath-default-namespace="http://www.w3.org/2000/svg" version="3.0">
  <xsl:output indent="yes"/>
  <!--<xsl:mode on-no-match = "deep-copy"/>-->
  <!--<xsl:mode on-no-match = "shallow-skip"/>-->
	<!-- <xsl:template match="/svg">
    <xsl:copy>
      <xsl:for-each select="g">
        <g>
          <xsl:copy-of select="defs"/>
          <xsl:copy>
            <xsl:for-each select="g[contains(@id,'edge')]">
							edge g {@id}
						<xsl:apply-templates/>
          </xsl:for-each>
            <xsl:for-each select="g[contains(@id,'node')]">
						node g
						<xsl:apply-templates/>
          </xsl:for-each>
          </xsl:copy>
        </g>
      </xsl:for-each>
    </xsl:copy>
	</xsl:template>-->
  <!--
# Preprocessing
# 1. x,y,height,width 5.831902424 -> 5.0
# 2. arrow head/body declaration
# 3. hyperlinks to ids, remove links
# 4+5. viewport
# commented out: 6. minify (remove new lines + spaces at line start)
# 7. add arrow body id = edgeId + "ArrowBody"
sed -i -z -r \
sed -i -z -r \
	-e 's/([xyth]\="[0-9]+)\.[0-9]+/\1.0/g' \
	-e 's/(<path fill="none" d="[0-9A-Z. ]* L)[0-9.]+ [0-9.]+"(\/>[\r\n]+[[:blank:]]*<path )(d="M)([0-9.]+ [0-9.]+)/\1\4" class="arrow-body" \2class="arrow-head" \3\4/g' \
	-e 's/<g id="y\.(node|edge)\.[0-9]{1,2}">[\r\n]+[[:blank:]]*<a target="_blank" xlink:type="simple" xlink:href="(https:\/\/hitontology.eu\/ontology\/)*([A-Za-z]+)" xlink:show="[a-zA-Z]+">[\r\n]+([0-9A-Za-z \t-.":(),<>=\r\n\/]+)([\r\n]+)[[:blank:]]+<\/a>/<g id="\3" class="\1">\5\4/g' \
	-e 's/width="([0-9]+)"([a-zA-Z0-9"'"'"' -=]+) height="([0-9]+)"/\2 viewbox="0 0 \1 \3" preserveAspectRatio="xMidYMid meet" width="100%"/1' \
	-e 's/id="genericDefs"/id="genericDefs" y="5"/1' \
	-e 's/id="([^"]+)"( class="edge">\n[[:blank:]]*<g[^\n]*\n[[:blank:]]*<path[^\n]*class="arrow-body")/id="\1"\2 id="\1ArrowBody"/g' \
	$IMGPATH/diagram.svg
#	-e 's/[\r\n]+[[:blank:]]*//g' \
	-->
	<!--<xsl:template match="//text">
    <xsl:copy>
      <xsl:apply-templates select="@*"/>
      <xsl:attribute name="x">  <xsl:value-of select="x" /></xsl:attribute>
    </xsl:copy>
  </xsl:template>--
<!--	<xsl:template match="//@height">
		<myelement>
			<xsl:attribute name="height">{@height}</xsl:attribute>
		</myelement>
</xsl:template>-->
  <xsl:template match="/bla">
    <!-- SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill-opacity="1" color-rendering="auto" color-interpolation="auto" text-rendering="auto" stroke="black" stroke-linecap="square" stroke-miterlimit="10" shape-rendering="auto" stroke-opacity="1" fill="black" stroke-dasharray="none" font-weight="normal" stroke-width="1" viewbox="0 0 1431 574" preserveAspectRatio="xMidYMid meet" width="100%" font-family="'Dialog'" font-style="normal" stroke-linejoin="miter" font-size="12px" stroke-dashoffset="0" image-rendering="auto">
      <!-- background white -->
      <rect width="100%" height="100%" fill="white" stroke="white"/>
      <!-- viewport -->
      <defs id="genericDefs" y="5"/>
      <g id="main-canvas">
        <xsl:for-each select="/g/g[a]">
          <g>
            <!-- add class edge/node -->
            <xsl:choose>
              <xsl:when test="contains(./@id,&quot;node&quot;)">
                <xsl:attribute name="class">node</xsl:attribute>
              </xsl:when>
              <xsl:when test="contains(./@id,&quot;edge&quot;)">
                <xsl:attribute name="class">edge</xsl:attribute>
              </xsl:when>
            </xsl:choose>
            <!-- put edges infront of nodes -->
            <!--<xsl:sort select="class"/>-->
            <!-- new id = href of the old link, but without the "https://hitontology.eu/ontology/" -->
            <xsl:attribute name="id">
              <xsl:value-of select="substring(a/@href,32)"/>
            </xsl:attribute>
            <!-- preserve children of a, but delete a -->
            <xsl:value-of select="a"/>
          </g>
        </xsl:for-each>
      </g>
      <!-- goodbye -->
    </svg>
  </xsl:template>
  <!-- arrow head/body classes -->
  <xsl:template match="/g/g/a/g/path[1]">
    <xsl:attribute name="class">arrowBody</xsl:attribute>
    <!-- arrow body id = node id + ArrowBody-->
    <xsl:attribute name="id"><xsl:value-of select="../../@id"/>ArrowBody</xsl:attribute>
  </xsl:template>
  <xsl:template match="/g/g/a/g/path[2]">
    <xsl:attribute name="class">arrowHead</xsl:attribute>
  </xsl:template>
</xsl:transform>

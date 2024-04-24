<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/g/g/a/g/path">
	</xsl:template>
	
	<xsl:template match="/">
		<!-- SVG -->
		<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill-opacity="1" color-rendering="auto" color-interpolation="auto" text-rendering="auto" stroke="black" stroke-linecap="square"  stroke-miterlimit="10" shape-rendering="auto" stroke-opacity="1" fill="black" stroke-dasharray="none" font-weight="normal" stroke-width="1" viewbox="0 0 1431 574" preserveAspectRatio="xMidYMid meet" width="100%" font-family="'Dialog'" font-style="normal" stroke-linejoin="miter" font-size="12px" stroke-dashoffset="0" image-rendering="auto">
  		<!-- background white -->
		<rect width="100%" height="100%" fill="white" stroke="white"/>
		<!-- viewport -->
		<defs id="genericDefs" y="5"/>
		<g id="main-canvas">
			<xsl:for-each select="/g/g[a]">
			<g>
				<!-- add class edge/node -->
				<xsl:choose>
					<xsl:when test='contains(./@id,"node")'>
						<xsl:attribute name="class">node</xsl:attribute>
					</xsl:when>
					<xsl:when test='contains(./@id,"edge")'>
						<xsl:attribute name="class">edge</xsl:attribute>
					</xsl:when>
				</xsl:choose>
				<!-- put edges infront of nodes -->
				<xsl:sort select="class" />
				<!-- new id = href of the old link, but without the "https://hitontology.eu/ontology/" -->
				<xsl:attribute name="id"><xsl:value-of select="substring(a/@href,32)"/></xsl:attribute>

				<!-- preserve children of a, but delete a -->
				<xsl:value-of select="a"/>
			</g>
			</xsl:for-each>
		</g>
	</xsl:template>
</xsl:transform>
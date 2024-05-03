<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform xmlns="http://www.w3.org/2000/svg" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xlink="http://www.w3.org/1999/xlink" xpath-default-namespace="http://www.w3.org/2000/svg" version="3.0">
  <xsl:output indent="yes"/>
  <!-- identity transform as baseline: keep original structure but perform small changes -->
  <xsl:mode on-no-match="shallow-copy"/>
  <!-- 
	SVG root element attribute replacement.
	-->
  <xsl:template match="/svg">
    <!-- Add viewport, preserve aspect ratio and set width to 100% for correct positioning and scaling. -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill-opacity="1" color-rendering="auto" color-interpolation="auto" text-rendering="auto" stroke="black" stroke-linecap="square" stroke-miterlimit="10" shape-rendering="auto" stroke-opacity="1" fill="black" stroke-dasharray="none" font-weight="normal" stroke-width="1" viewbox="0 0 1431 574" preserveAspectRatio="xMidYMid meet" width="100%" font-family="'Dialog'" font-style="normal" stroke-linejoin="miter" font-size="12px" stroke-dashoffset="0" image-rendering="auto">
      <defs id="genericDefs" y="5"/>
      <!-- identity transform child elements -->
      <xsl:apply-templates select="node()"/>
    </svg>
  </xsl:template>
  <!--
	round coordinate values to two decimal places
	-->
  <xsl:template match="(@height|@width|@x|@y)">
    <xsl:choose>
      <xsl:when test="number(.)">
        <xsl:attribute name="{name()}">
          <xsl:value-of select="round(number(.) * 100) div 100"/>
        </xsl:attribute>
      </xsl:when>
      <xsl:otherwise>
        <xsl:copy/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!--
	edges first, nodes last
	-->
  <xsl:template match="/svg/g">
    <g>
      <xsl:copy-of select="defs"/>
      <xsl:for-each select="g[contains(@id,'edge')]">
        <g class="edge">
          <xsl:call-template name="hyperlinktoid"/>
        </g>
      </xsl:for-each>
      <!-- There are some nodes like firstAuthor this assigns an empty ID, investigate if this is problematic. -->
      <xsl:for-each select="g[contains(@id,'node')]">
        <g class="node">
          <xsl:call-template name="hyperlinktoid"/>
        </g>
      </xsl:for-each>
    </g>
  </xsl:template>
  <!--
	generic defs set y=5 @HRB do we actually need this?
	-->
  <xsl:template match="defs[@id='genericDefs']">
    <defs id="genericDefs" y="5"/>
  </xsl:template>
  <!--
	hyperlinks to ids
	-->
  <!--<xsl:template match="g[matches(@id,'^y')]">-->
  <xsl:template name="hyperlinktoid">
    <xsl:attribute name="id">
      <xsl:value-of select="replace(a/@xlink:href,'https://hitontology.eu/ontology/','')"/>
    </xsl:attribute>
    <xsl:apply-templates select="node()"/>
  </xsl:template>
  <!---
	remove links and add arrow classes and IDs
	-->
  <xsl:template match="a">
    <xsl:variable name="suffix" select="replace(@xlink:href,'https://hitontology.eu/ontology/','')"/>
    <xsl:for-each select="g">
      <xsl:copy>
        <xsl:apply-templates select="node()[not(name() = 'path')] | @*"/>
        <xsl:for-each select="path">
          <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:choose>
              <xsl:when test="position() = 1">
                <xsl:attribute name="class">arrow-body</xsl:attribute>
                <xsl:attribute name="id">
                  <xsl:value-of select="$suffix"/>
                </xsl:attribute>
              </xsl:when>
              <xsl:when test="position() = 2">
                <xsl:attribute name="class">arrow-head</xsl:attribute>
              </xsl:when>
              <xsl:otherwise>
                <xsl:apply-templates select="node()"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:copy>
        </xsl:for-each>
      </xsl:copy>
    </xsl:for-each>
  </xsl:template>
  <!--
	-->
  <!--
  <xsl:template>
  </xsl:template>
	-->
  <!---
# Preprocessing
# 
-->
</xsl:transform>

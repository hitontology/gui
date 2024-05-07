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
      <defs>
        <style>
          .grouptext {
            font-family: sans-serif;
            stroke: none;
            text-anchor: middle;
            font-weight: bold;
          }
          .grouprect {
          stroke-dasharray: 5,10; stroke:black; fill:none;
          }
        </style>
        <!-- Overriding width does not work in Firefox when loaded with SVG.js, no fix found so we use a class instead. -->
        <!--
        <symbol id="grouprect" preserveAspectRatio="xMinYMin" viewbox="0 0 220 215">
          <rect width="100%" height="100%" stroke-dasharray="5,10" stroke="black" fill="none"/>
        </symbol>
          -->
      </defs>
      <xsl:apply-templates select="node()"/>
      <!-- manually add group overlays -->
      <!-- can SVG extract common attributes to shorten the code? -->
      <!-- text x = half rect width-->
      <g font-family="sans-serif">
        <g transform="translate(370 10)">
          <text x="110" y="10" class="grouptext">application system types</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(651 10)">
          <text x="110" y="15" class="grouptext">functions</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(941 10)">
          <text x="110" y="15" class="grouptext">features</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(320 378)">
          <rect class="grouprect" width="237" height="210"/>
          <text x="118" y="205" class="grouptext">organizational units</text>
        </g>
        <g transform="translate(575 378)">
          <rect class="grouprect" width="223" height="215"/>
          <text x="111" y="205" class="grouptext">roles</text>
        </g>
        <g transform="translate(1220 218)">
          <text x="111" y="10" class="grouptext">outcome criteria</text>
          <rect class="grouprect" width="217" height="160"/>
        </g>
      </g>
      <!-- identity transform child elements -->
    </svg>
  </xsl:template>
  <xsl:template match="/svg/g[1]">
  </xsl:template>
  <!--
  round numerical values to two decimal places
  -->
  <xsl:template match="(@height|@width|@x|@y)">
    <xsl:copy/>
    <xsl:if test="number(.)">
      <xsl:attribute name="{name()}">
        <xsl:value-of select="round(number(.) * 100) div 100"/>
      </xsl:attribute>
    </xsl:if>
  </xsl:template>
  <!--
  edges first, nodes last
  -->
  <xsl:template match="/svg/g">
    <g>
      <xsl:copy-of select="defs"/>
      <xsl:for-each select="g[contains(@id,'edge')]">
        <xsl:copy>
          <xsl:attribute name="class">edge</xsl:attribute>
          <xsl:call-template name="hyperlinktoid"/>
        </xsl:copy>
      </xsl:for-each>
      <!-- There are some nodes, like firstAuthor, which this assigns an empty ID to, investigate if this is problematic. -->
      <xsl:for-each select="g[contains(@id,'node')]">
        <g class="node">
          <xsl:call-template name="hyperlinktoid"/>
        </g>
      </xsl:for-each>
    </g>
  </xsl:template>
  <!--
  hyperlinks to ids
  -->
  <xsl:template name="hyperlinktoid">
    <xsl:attribute name="id">
      <xsl:value-of select="replace(a/@href,'https://hitontology.eu/ontology/','')"/>
    </xsl:attribute>
    <xsl:apply-templates select="node()"/>
  </xsl:template>
  <!---
  remove links and add arrow classes and IDs
  -->
  <xsl:template match="a">
    <xsl:variable name="suffix" select="replace(@href,'https://hitontology.eu/ontology/','')"/>
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
  rename catalogues, classifieds and citations
  -->
  <xsl:template match="text/text()">
    <xsl:value-of select="replace(replace(replace(.,'.*Catalogue','terminologies'),'.*Classified','terminology items'),'.*Citation','folks` terms')"/>
  </xsl:template>
</xsl:transform>

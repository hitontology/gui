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
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill-opacity="1" color-rendering="auto" color-interpolation="auto" text-rendering="auto" stroke="black" stroke-linecap="square" stroke-miterlimit="10" shape-rendering="auto" stroke-opacity="1" fill="black" stroke-dasharray="none" font-weight="normal" stroke-width="1" viewbox="0 0 1431 593" preserveAspectRatio="xMidYMid meet" width="100%" font-family="'Dialog'" font-style="normal" stroke-linejoin="miter" font-size="12px" stroke-dashoffset="0" image-rendering="auto">
      <defs>
        <style>
          .grouptext {
            font-family: sans-serif;
            stroke: none;
            text-anchor: middle;
            dominant-baseline: middle;
            font-weight: bold;
          }
          .grouprect {
          stroke-dasharray: 5,10; stroke:black; fill:none;
          }
          .rect {
          stroke:black; fill:none;
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
          <title>Application system: Installation of a certain application software product on a certain computer system.</title>
          <text x="110" y="15" class="grouptext" id="ApplicationSystemType">application system types</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(651 10)">
          <title>Information processing function (short: function): Directive in a health care setting on how to use data on entity types and how to update data on entity types.</title>
          <text x="110" y="15" class="grouptext" id="EnterpriseFunction">enterprise functions</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(941 10)">
          <title>Feature: Functionality offered by the application software product of an application system which directly contributes to the fulfillment of one or more functions.</title>
          <text x="110" y="15" class="grouptext" id="Feature">features</text>
          <rect width="220" height="215" class="grouprect"/>
        </g>
        <g transform="translate(320 378)">
          <title>Organizational unit: Part of a health care facility which can be defined by responsibilities.</title>
          <rect class="grouprect" width="237" height="205"/>
          <text x="118" y="200" class="grouptext" id="OrganizationalUnit">organizational units</text>
        </g>
        <g transform="translate(575 378)">
          <title>Role: Sum of expectations addressed to persons or groups of persons.</title>
          <rect class="grouprect" width="223" height="205"/>
          <text x="111" y="200" class="grouptext" id="UserGroup">roles</text>
        </g>
        <g transform="translate(1220 220)">
          <title>Outcome criteria of an evaluation study.</title>
          <text x="111" y="5" class="grouptext" id="OutcomeCriteria">outcome criteria</text>
          <rect class="grouprect" width="215" height="160"/>
        </g>
        <!-- reset button -->
        <g transform="translate(0 0)" id="reset">
          <title>Reset</title>
          <text x="50" y="10" class="grouptext">Reset</text>
          <rect class="rect" width="100" height="20" rx="4" ry="4"/>
        </g>
        <!-- identity transform child elements -->
      </g>
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
      <xsl:if test="a">
        <xsl:value-of select="replace(a/@xlink:href,'https://hitontology.eu/ontology/','')"/>
      </xsl:if>
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
                <xsl:attribute name="id"><xsl:value-of select="$suffix"/>ArrowBody</xsl:attribute>
                <!-- use the last coordinate of the arrow head as replacement for the last coordinate of the arrow body -->
                <!-- this allows hiding the arrow head -->
                <xsl:variable name="headd" select="../path[2]/@d"/>
                <xsl:variable name="headstart" select="replace($headd,&quot;M([0-9. ]*) L.*&quot;,&quot;$1&quot;)"/>
                <xsl:attribute name="d">
                  <xsl:value-of select="replace(@d,&quot;[^L]+$&quot;,$headstart)"/>
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
  Multiple templates with the same match priority are an error according to the XSLT spec, so we have to nest the replace function, even though it is hard to read.
  The inserted spaces are a workaround to somewhat center the labels as their positions are hardcoded in the yEd SVG export, see <https://yed.yworks.com/support/qa/28414/center-text-the-elegant-way-in-svg-export>.
  In case they fix this in the future we may remove that part.
  -->
  <xsl:template match="text/text()">
    <xsl:value-of select="replace(replace(replace(replace(.,'EnterpriseFunction|OrganizationalUnit|ApplicationSystemType|OutcomeCriteria','            '),'[^ ]*Catalogue','terminologies'),'[^ ]*Classified','terminology items'),'[^ ]*Citation','folks` terms')"/>
  </xsl:template>
</xsl:transform>

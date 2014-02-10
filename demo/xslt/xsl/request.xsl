<?xml version='1.0'?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:func="http://exslt.org/functions"
    xmlns:request="http://8080.spb.ru/functions/request"
    extension-element-prefixes="func"
    exclude-result-prefixes="request"
>
    <!-- 
    <func:function name="request:param2">
        <xsl:param name="name"/>
        <func:result select="/request/parameter[@name = $name]"/>
    </func:function>
    -->

    <!-- 
        Осуществляет выборку значения параметра из плоского xml-дерева.
        Параметры находятся по адресу ./request-tree.xml
        Каждый параметр представлен следующим образом
        <parameter name="{имя параметра}" num="{идентификатор в дереве}" parent-num="{идентификатор родителя}">{значение}</parameter>
        
        @param string name имя праметра вида a[b][c][d]
        @return string|boolean
    -->
    <func:function name="request:param">
        <!-- имя параметра -->
        <xsl:param name="name"/>
        <!-- необязательный. номер родителя -->
        <xsl:param name="parent"/>
        <!-- переменные -->
        <xsl:variable name="params" select="/request/parameter"/>
        <xsl:variable name="before-open" select="substring-before($name, '[')"/>
        <xsl:variable name="before-close" select="substring-before($name, ']')"/>
        <xsl:choose>
            <!-- единственный элемент -->
            <xsl:when test="$before-open = '' and $before-close = ''">
                <xsl:choose>
                    <xsl:when test="count($params[@key = $name and not(@parent-id != '')]) != 0">
                        <func:result select="$params[@key = $name and not(@parent-id != '')]"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <func:result select="false()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <!-- средний элемент (требуется предыдущий) -->
            <xsl:when test="$before-open = '' and string-length(substring-after($name, '[')) and $parent != ''">
                <func:result select="request:param(substring-after($name, ']['), $params[@key = $before-close]/@id)"/>
            </xsl:when>
            <!-- последний элемент (требуется предыдущий) -->
            <xsl:when test="$before-open = ''">
                <xsl:choose>
                    <xsl:when test="count($params[@key = $before-close and @parent-id = $parent]) != 0">
                        <func:result select="$params[@key = $before-close and @parent-id = $parent]"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <func:result select="false()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <!-- первый элемент -->
            <xsl:when test="string-length($before-open) &lt; string-length($before-close)">
                <func:result select="request:param(substring-after($name, '['), $params[@key = $before-open]/@id)"/>
            </xsl:when>
            <!-- средний элемент (требуется предыдущий) -->
            <xsl:when test="string-length($before-close) &lt; string-length($before-open)">
                <func:result select="request:param(substring-after($name, '['), $params[@key = $before-close]/@id)"/>
            </xsl:when>
            <xsl:otherwise>
                <func:result select="false()"/>
            </xsl:otherwise>
        </xsl:choose>
    </func:function>
</xsl:stylesheet>
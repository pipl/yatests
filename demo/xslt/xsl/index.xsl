<?xml version='1.0'?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:request="http://8080.spb.ru/functions/request"
>
    <xsl:output method="html"
        indent="yes"
    />
    
    <xsl:include href="request.xsl"/>
    
    <xsl:param name="debug"/>
    <xsl:param name="query"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <style>
                .result {
                    padding: 1em 1.2em;
                    background-color: #E3EBFF;
                }
                </style>
            </head>
            <body>
                <h2>ТЗ №1 (по XSL)</h2>
                <p>
                    Обрабатываются get/post-параметры http-запроса.
                    <br/>
                    Их список доступен в виде плоского xml-дерева.
                    <br/>
                    Напишите на xsl функцию, получающую на вход имя параметра, и возвращающую значение этого параметра.
                    <br/>
                </p>
                <div class="result">
                    <a href="xsl/request.xsl">Файл request.xsl</a>
                    
                    <h3>XML request</h3>
                    <xmp>
                        <xsl:copy-of select="/"/>
                    </xmp>
                    
                    <h3>Результат</h3>
                    <xsl:value-of select="concat('request:param(', $debug, ') = ', request:param($debug), '')"/><br/>
                </div>
                <hr/>
        
                <p>
                    Введите строку запроса и искомый параметр
                </p>
                <form>
                    <div>
                        Строка запроса:<br/>
                        <textarea name="query" cols="60"><xsl:value-of select="$query"/></textarea>
                    </div>
                    <div>
                        Имя параметра:<br/>
                        <input name="debug" value="{$debug}"/>
                        <input type="submit" value="Найти"/>
                    </div>
                    <div>
                    </div>
                </form>
        
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
<?php
session_start();
$_SESSION['THUMB'] = true;
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="css/pslider.css" type="text/css" media="screen" />
        
        <script src="js/fullscreen-api-polyfill.js"></script>
        <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
        <script src="http://code.jquery.com/ui/1.9.2/jquery-ui.min.js"></script>
        <script src="js/pslider.js"></script>
        
        <script type="text/javascript">
            $(function () {
                $('.pslider').pslider();
            });
        </script>
    </head>
    <body>
        <h2>ТЗ №1 (по XSL)</h2>
        <p>
            Реализуйте систему для показа презентаций. Подумайте, как реализовать переключение слайдов и навигацию.
            <br/>
            Предусмотрите возможность размещения нескольких презентаций на одной странице.
            <br/>
            Рекомендуется использование jQuery.
            <br/>
            Код необходимо разместить на одном из специализированных хранилищ: GitHub, Bitbucket, code.google.com и т. д.
            <br>
            <br>
            Краткая инструкция:
        </p>
        <div style="overflow: hidden">
            <img src="help.png" align="left">
        </div>
        <p>
            PS. Да, забыл. На ленте тоже можно кликать слайды.
        </p>
        <hr>
        
        <h3>Две презентации</h3>
        
        <div class="pslider" data-name="2"></div>
        <br>
        <br>
        <br>
        <div class="pslider" data-name="3"></div>
        <div style="position: absolute; top: 0; right: 0">
<!--LiveInternet counter--><script type="text/javascript"><!--
document.write("<a href='http://www.liveinternet.ru/click' "+
"target=_blank><img src='//counter.yadro.ru/hit?t44.1;r"+
escape(document.referrer)+((typeof(screen)=="undefined")?"":
";s"+screen.width+"*"+screen.height+"*"+(screen.colorDepth?
screen.colorDepth:screen.pixelDepth))+";u"+escape(document.URL)+
";"+Math.random()+
"' alt='' title='LiveInternet' "+
"border='0' width='31' height='31'><\/a>")
//--></script><!--/LiveInternet-->
        </div>
    </body>
</html>





<?php
header('Content-type: text/html;charset=utf-8');
?>
<!DOCTYPE html>
<html>
    <head>
        <style>
        .result {
            padding: 1em 1.2em;
            background-color: #E3EBFF;
        }
        </style>
        <script src="js.js"></script>
        <script>
        console.dir(parseQuery(location.search.substring(1)));
        </script>
    </head>
    <body>
        <h2>ТЗ № 2.1 (по JS)</h2>
        <p>
            Напишите функцию разбора query-строки в набор параметров.
        </p>
        <div class="result">
            <a href="xsl/request.xsl">Файл request.xsl</a>
            <h3>
                from PHP:
            </h3>
            <xmp><?php var_dump($_GET); ?></xmp>
        </div>
        <hr/>
        <p>
            Введите в адресную строку браузера параметры.
            <br>
            Дождитесь ответа
            <br>
            Откройте консоль
            <br>
            Сравните результат с результатом сервера
            <br>
            Или наберите в консоли следующий код:
        </p>
        <xmp>
            console.dir(parseQuery(str));
        </xmp>
        <b>Обратите внимание на обработку параметров вида a[[[o[[]</b>
    </body>
</html>

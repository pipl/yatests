<?php

$request = (array) filter_input_array(INPUT_GET);

// a[][]=1&a[0][]=2&a[0][]=3&b=700&вася=привет
$query = '';
if (!empty($request['query'])) {
    $query = trim($request['query']);
}

$debug = '';
if (!empty($request['debug'])) {
    $debug = $request['debug'];
}

parse_str($query, $params);

$Doc = new DOMDocument('1.0', 'utf-8');
$Doc->formatOutput = true;
$Request = $Doc->appendChild($Doc->createElement('request'));
foreach (getRequestPlainTree($params) as $param) {
    $Parameter = $Request->appendChild($Doc->createElement('parameter'));
    foreach ($param as $name => $value) {
        if ($name != 'value') {
            $Parameter->setAttribute($name, $value);
        }
        else {
            $Parameter->appendChild($Doc->createCDATASection($value));
        }
    }
}

$Doc = new DOMDocument();
$Doc->loadXML($Request->ownerDocument->saveXML());

$Stylesheet = new DOMDocument();
$Stylesheet->load('xsl/index.xsl');

$Processor = new XSLTProcessor;
$Processor->setParameter('', 'debug', $debug);
$Processor->setParameter('', 'query', $query);
$Processor->importStyleSheet($Stylesheet);
echo $Processor->transformToXML($Doc);


function getRequestPlainTree(array $request, $keys = array())
{
    static $id = 0;
    
    $name = reset($keys);
    if (count($keys) > 1) {
        $name .= '[' . implode('][', array_slice($keys, 1)) . ']';
    }
    $parent = end(array_keys($keys));
    
    $result = array();
    foreach ($request as $key => $value) {
        if (is_array($value) && !$value) {
            continue;
        }
        
        $id++;
        
        $param = array(
            'key' => $key,
            'id' => $id,
        );
        if ($parent) {
            $param['parent-id'] = $parent;
        }
        if (!is_array($value)) {
            $param['name'] = $name . sprintf($keys ? '[%s]' : '%s', $key);
            $param['value'] = $value;
        }
        
        $result[] = $param;
        if (is_array($value)) {
            $result = array_merge($result, call_user_func(__FUNCTION__, $value, $keys + array($id => $key)));
        }
    }
    return $result;
}


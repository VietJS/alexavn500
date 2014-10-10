#!/usr/bin/env php
<?php
require_once dirname(__FILE__) . '/pr.class.php';
$pr = new PR();
echo $pr->get_google_pagerank($argv[1]);
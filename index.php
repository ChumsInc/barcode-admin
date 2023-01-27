<?php
/**
 * @package Chums Inc
 * @subpackage Imprint Status
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2011, steve
 */

require_once "autoload.inc.php";
require_once "access.inc.php";

$bodyPath = "apps/barcode-admin";
$title = "Barcode Admin";

$ui = new WebUI($bodyPath, $title, '', true, 5);
$ui->bodyClassName = 'container-fluid';

$ui->AddCSS("public/main.css");
$ui->addManifest('public/js/manifest.json');
$ui->Send();

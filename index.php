<?php
/**
 * @package Chums Inc
 * @subpackage Imprint Status
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2011, steve
 */

use chums\ui\WebUI2;
use chums\ui\CSSOptions;
use chums\user\Groups;

require_once "autoload.inc.php";

$ui = new WebUI2([
    'requiredRoles' => [Groups::BARCODE],
    'title' => 'Barcode Admin',
    "bodyClassName" => 'container-fluid',
    "contentFile" => 'body.inc.php',
]);
$ui->addCSS('public/main.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->addManifestJSON('public/js/manifest.json')
    ->render();

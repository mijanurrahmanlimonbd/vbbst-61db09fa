<?php
/**
 * PHP Proxy for Branded Media URLs
 * Fallback if mod_proxy is unavailable on Hostinger.
 *
 * Usage in .htaccess:
 *   RewriteRule ^media/(.+)$ /media-proxy.php?file=$1 [L,QSA]
 *
 * This script fetches the image from Supabase storage
 * and streams it back with proper cache headers.
 */

$file = isset($_GET['file']) ? $_GET['file'] : '';

if (empty($file) || preg_match('/\.\./', $file)) {
    http_response_code(400);
    exit('Bad request');
}

$supabaseUrl = 'https://xukkejkvcgixogvbllmf.supabase.co/storage/v1/object/public/media/' . $file;

// Determine bucket from referer path
$bucket = 'media';
if (isset($_GET['bucket']) && $_GET['bucket'] === 'branding') {
    $supabaseUrl = 'https://xukkejkvcgixogvbllmf.supabase.co/storage/v1/object/public/branding/' . $file;
}

$ch = curl_init($supabaseUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

if ($httpCode !== 200) {
    http_response_code($httpCode ?: 404);
    curl_close($ch);
    exit('File not found');
}

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);
curl_close($ch);

// Extract content-type
if (preg_match('/content-type:\s*([^\r\n]+)/i', $headers, $m)) {
    header('Content-Type: ' . trim($m[1]));
} else {
    header('Content-Type: application/octet-stream');
}

// Cache for 1 year (files are hashed/immutable)
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');

echo $body;

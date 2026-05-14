<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$dataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
$logFile = $dataDir . DIRECTORY_SEPARATOR . 'contact_submissions.txt';

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function htmlShell(string $title, string $bodyInner): string
{
    $t = h($title);
    return '<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8" />
<title>' . $t . '</title>
<style>body{font-family:system-ui,sans-serif;background:#f6f7fa;margin:0;padding:40px;}
.box{max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:16px;border:1px solid #e0e0e0;}
h1{font-size:1.35rem;color:#1a1a2e;}p{color:#555;line-height:1.7;}
a{display:inline-block;margin-top:20px;background:#e63946;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;}</style>
</head>
<body>
<div class="box">' . $bodyInner . '</div>
</body>
</html>';
}

function validEmail(string $email): bool
{
    return (bool) preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email);
}

function validateContact(string $nume, string $email, string $subiect, string $mesaj): array
{
    $errs = [];
    if (trim($nume) === '') {
        $errs[] = 'Lipsește numele.';
    }
    if (trim($email) === '') {
        $errs[] = 'Lipsește email-ul.';
    } elseif (!validEmail(trim($email))) {
        $errs[] = 'Email invalid.';
    }
    if (trim($subiect) === '') {
        $errs[] = 'Lipsește subiectul.';
    }
    if (strlen(trim($mesaj)) < 10) {
        $errs[] = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
    }
    return $errs;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo htmlShell('Contact — ChirieAuto', '<h1>Formular</h1><p>Folosiți formularul de contact.</p><p><a href="../Pagini/contact.html">Contact</a></p>');
    exit;
}

$nume = trim((string) ($_POST['nume'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subiect = trim((string) ($_POST['subiect'] ?? ''));
$mesaj = (string) ($_POST['mesaj'] ?? '');

$errs = validateContact($nume, $email, $subiect, $mesaj);
if ($errs !== []) {
    http_response_code(400);
    $list = '<h1>Date incomplete</h1><ul>';
    foreach ($errs as $e) {
        $list .= '<li>' . h($e) . '</li>';
    }
    $list .= '</ul><p><a href="../Pagini/contact.html">Înapoi la formular</a></p>';
    echo htmlShell('Eroare — Contact', $list);
    exit;
}

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$ts = date('Y-m-d H:i:s');
$line = sprintf(
    "[%s] nume=%s | email=%s | subiect=%s | mesaj_len=%d\n",
    $ts,
    var_export($nume, true),
    var_export($email, true),
    var_export($subiect, true),
    strlen($mesaj)
);
file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

$body = '<h1>Mesaj primit</h1>'
    . '<p>Mulțumim, <strong>' . h($nume) . '</strong>!</p>'
    . '<p>Am înregistrat mesajul cu subiectul „<strong>' . h($subiect) . '</strong>”. '
    . 'Vă vom răspunde în cel mult <strong>30 de minute</strong> în timpul programului.</p>'
    . '<p><a href="../Pagini/contact.html">Trimite alt mesaj</a> · '
    . '<a href="../index.html">Acasă</a></p>';

echo htmlShell('Mesaj trimis — ChirieAuto', $body);

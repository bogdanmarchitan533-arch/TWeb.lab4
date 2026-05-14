<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$dataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
$logFile = $dataDir . DIRECTORY_SEPARATOR . 'rezervari_submissions.txt';

/** @var array<int, array{0: string, 1: int}> */
$CARS = [
    1 => ['Dacia Logan', 250],
    2 => ['Volkswagen Polo', 320],
    3 => ['Toyota Camry', 480],
    4 => ['Ford Transit', 600],
    5 => ['BMW Seria 3', 750],
    6 => ['Skoda Octavia', 380],
    7 => ['Kia Sportage', 580],
    8 => ['Mercedes C-Class', 1200],
];

$LOC_LABEL = [
    'central' => 'Biroul Central — Str. Ștefan cel Mare 10, Chișinău',
    'aeroport' => 'Aeroport Chișinău',
    'gara' => 'Gara Feroviară',
    'livrare' => 'Livrare la adresă (+200 lei)',
];

$LOC_EXTRA = [
    'central' => 0,
    'aeroport' => 0,
    'gara' => 0,
    'livrare' => 200,
];

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
.box{max-width:580px;margin:0 auto;background:#fff;padding:32px;border-radius:16px;border:1px solid #e0e0e0;}
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

/** @return array{0: array<string>, 1: array<string, mixed>} */
function validateRezervare(array $post, array $cars): array
{
    $msgs = [];
    $nume = trim((string) ($post['nume'] ?? ''));
    $prenume = trim((string) ($post['prenume'] ?? ''));
    $tel = trim((string) ($post['telefon'] ?? ''));
    $email = trim((string) ($post['email'] ?? ''));
    $masina = (string) ($post['masina'] ?? '');
    $dataStart = trim((string) ($post['data_start'] ?? ''));
    $dataEnd = trim((string) ($post['data_end'] ?? ''));
    $loc = trim((string) ($post['loc_ridicare'] ?? 'central')) ?: 'central';
    $obs = trim((string) ($post['observatii'] ?? ''));
    if ($obs === '') {
        $obs = '—';
    }

    if ($nume === '') {
        $msgs[] = 'Introduceți numele.';
    }
    if ($prenume === '') {
        $msgs[] = 'Introduceți prenumele.';
    }
    if ($tel === '') {
        $msgs[] = 'Introduceți telefonul.';
    } elseif (strlen(preg_replace('/\D/', '', $tel)) < 8) {
        $msgs[] = 'Telefonul pare incomplet.';
    }
    if ($email === '') {
        $msgs[] = 'Introduceți email-ul.';
    } elseif (!validEmail($email)) {
        $msgs[] = 'Email invalid.';
    }

    $carId = (int) $masina;
    if (!isset($cars[$carId])) {
        $msgs[] = 'Selectați o mașină validă.';
    }

    if ($dataStart === '') {
        $msgs[] = 'Selectați data ridicării.';
    }
    if ($dataEnd === '') {
        $msgs[] = 'Selectați data returnării.';
    }

    $days = rentalDaysInclusive($dataStart, $dataEnd);
    if ($days === -1) {
        $msgs[] = 'Data returnării trebuie să fie după sau egală cu data ridicării.';
    } elseif ($days === -2) {
        $msgs[] = 'Date invalide.';
    } elseif ($dataStart !== '' && $dataEnd !== '' && $days <= 0) {
        $msgs[] = 'Perioada de închiriere invalidă.';
    }

    $data = [
        'nume' => $nume,
        'prenume' => $prenume,
        'tel' => $tel,
        'email' => $email,
        'car_id' => $carId,
        'data_start' => $dataStart,
        'data_end' => $dataEnd,
        'loc' => $loc,
        'obs' => $obs,
    ];

    return [$msgs, $data];
}

function rentalDaysInclusive(string $start, string $end): int
{
    if ($start === '' || $end === '') {
        return 0;
    }
    $ds = DateTime::createFromFormat('Y-m-d', $start);
    $de = DateTime::createFromFormat('Y-m-d', $end);
    if ($ds === false || $de === false) {
        return -2;
    }
    $ds->setTime(0, 0);
    $de->setTime(0, 0);
    if ($de < $ds) {
        return -1;
    }
    return (int) $de->diff($ds)->days + 1;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo htmlShell('Rezervare — ChirieAuto', '<h1>Formular</h1><p>Folosiți formularul de rezervare.</p><p><a href="../Pagini/rezervare.html">Rezervare</a></p>');
    exit;
}

[$msgs, $d] = validateRezervare($_POST, $CARS);
if ($msgs !== []) {
    http_response_code(400);
    $list = '<h1>Date incomplete</h1><ul>';
    foreach ($msgs as $e) {
        $list .= '<li>' . h($e) . '</li>';
    }
    $list .= '</ul><p><a href="../Pagini/rezervare.html">Înapoi la formular</a></p>';
    echo htmlShell('Eroare — Rezervare', $list);
    exit;
}

$carId = (int) $d['car_id'];
[$carName, $price] = $CARS[$carId];
$days = rentalDaysInclusive((string) $d['data_start'], (string) $d['data_end']);
$locKey = isset($LOC_EXTRA[$d['loc']]) ? (string) $d['loc'] : 'central';
$extra = $LOC_EXTRA[$locKey];
$locText = $LOC_LABEL[$locKey] ?? $locKey;
$total = $price * $days + $extra;

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$ts = date('Y-m-d H:i:s');
$obsStr = (string) $d['obs'];
$obsSnippet = extension_loaded('mbstring')
    ? mb_substr($obsStr, 0, 200, 'UTF-8')
    : substr($obsStr, 0, 200);
$line = sprintf(
    "[%s] %s %s | %s | tel=%s | masina_id=%d (%s) | %s–%s | zile=%d | loc=%s | total_estimat=%d | obs=%s\n",
    $ts,
    $d['nume'],
    $d['prenume'],
    $d['email'],
    $d['tel'],
    $carId,
    $carName,
    $d['data_start'],
    $d['data_end'],
    $days,
    $locKey,
    $total,
    var_export($obsSnippet, true)
);
file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

$ziLabel = $days === 1 ? 'zi' : 'zile';
$extraNote = $extra > 0 ? ' (inclusiv supliment ridicare: ' . $extra . ' lei)' : '';

$body = '<h1>Rezervare înregistrată</h1>'
    . '<p>Bună ziua, <strong>' . h((string) $d['nume']) . ' ' . h((string) $d['prenume']) . '</strong>!</p>'
    . '<p>Am înregistrat rezervarea pentru <strong>' . h($carName) . '</strong>, '
    . $days . ' ' . $ziLabel . ' (' . h((string) $d['data_start']) . ' → ' . h((string) $d['data_end']) . ').</p>'
    . '<p><strong>Total estimat:</strong> ' . $total . ' lei' . h($extraNote) . '.</p>'
    . '<p><strong>Loc ridicare:</strong> ' . h($locText) . '</p>'
    . '<p><strong>Observații:</strong> ' . h((string) $d['obs']) . '</p>'
    . '<p>Un operator vă va contacta în cel mult <strong>2 ore</strong> la numărul indicat.</p>'
    . '<p><a href="../Pagini/rezervare.html">Formular nou</a> · '
    . '<a href="../index.html">Acasă</a></p>';

echo htmlShell('Rezervare trimisă — ChirieAuto', $body);

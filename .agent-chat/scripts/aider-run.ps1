# Aider + Ollama Runner
# Запускає Aider з локальною моделлю через Ollama

param(
    [string]$Task = "",
    [string]$Files = "",
    [string]$Model = "deepseek-coder-v2:16b"
)

$ProjectRoot = "C:\CFC"
$ChatDir = "$ProjectRoot\.agent-chat"
$MessagesDir = "$ChatDir\messages"
$PromptsDir = "$ChatDir\prompts"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Aider + Ollama — Evolve Agent" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Запустити Ollama якщо не запущена
Write-Host "[1] Ollama server..." -ForegroundColor Yellow
$ollama = Get-Process -Name "ollama" -ErrorAction SilentlyContinue
if (-not $ollama) {
    Write-Host "  Запускаю ollama serve..."
    Start-Process "ollama" -ArgumentList "serve" -NoNewWindow -WorkingDirectory $ProjectRoot
    Start-Sleep -Seconds 5
}
Write-Host "  OK" -ForegroundColor Green

# 2. Встановити модель якщо ще немає
Write-Host "[2] Модель $Model..." -ForegroundColor Yellow
$have = ollama list 2>$null | Select-String $Model
if (-not $have) {
    Write-Host "  Завантажую ollama pull $Model..."
    ollama pull $Model
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ПОМИЛКА: не вдалось завантажити модель" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  OK" -ForegroundColor Green

# 3. Пошук задачі
Write-Host "[3] Задача..." -ForegroundColor Yellow
if ($Task) {
    Write-Host "  З параметра: $Task" -ForegroundColor White
} else {
    # Чи є повідомлення для aider в чаті?
    $msgs = Get-ChildItem "$MessagesDir\*.md" -ErrorAction SilentlyContinue | Sort-Object Name
    $found = $false
    foreach ($m in $msgs) {
        $c = Get-Content $m.FullName -Raw
        if ($c -match "to: aider|to: all" -and $c -match "status: unread") {
            if ($c -match "subject: (.+)") { $Task = $Matches[1] }
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Host "  Немає задач. Запустіть з -Task" -ForegroundColor Gray
        exit 0
    }
}
Write-Host "  $Task" -ForegroundColor White

# 4. Запуск Aider
Write-Host "[4] Запуск Aider..." -ForegroundColor Yellow
Write-Host ""

$argsList = @("--model", "ollama/$Model")

if ($Files) {
    foreach ($f in ($Files -split "\s+")) {
        $fp = Join-Path $ProjectRoot $f
        if (Test-Path $fp) { $argsList += @("--file", $fp) }
    }
}

# —no-auto-commits щоб не комітити автоматично
if ($Task) { $argsList += @("--message", $Task) }

Write-Host "> aider $($argsList -join ' ')" -ForegroundColor Cyan
Write-Host ""

& aider $argsList

$baseDir = "C:\Users\Satyam\Downloads\WD\GG Collage"
$files = @(
    "$baseDir\public\index.html",
    "$baseDir\public\sitemap.html"
) + (Get-ChildItem "$baseDir\public\pages\*.html" | Select-Object -ExpandProperty FullName)

$scrollAdded = 0
$scrollFixed = 0
$imgFixed = 0
$cardFixed = 0
$revealFixed = 0

$revealTargets = @(
    "$baseDir\public\pages\accessibility-statement.html",
    "$baseDir\public\pages\admission-apply.html",
    "$baseDir\public\pages\privacy-policy.html"
)

foreach ($f in $files) {
    $content = Get-Content -LiteralPath $f -Raw
    $orig = $content

    # ===== Step 1: Scroll-progress =====
    if ($content -notmatch 'id=.scrollProgress') {
        # Add after <body> or <body class="...">
        $content = $content -replace '(?<=<body[^>]*>)', ' <div class="scroll-progress" id="scrollProgress" role="progressbar" aria-label="Page scroll progress"></div>'
        $scrollAdded++
        Write-Host "  [$(Split-Path $f -Leaf)] Added scroll-progress bar"
    } elseif ($content -match 'class="" id="scrollProgress"') {
        $content = $content -replace 'class="" id="scrollProgress"', 'class="scroll-progress" id="scrollProgress"'
        $scrollFixed++
        Write-Host "  [$(Split-Path $f -Leaf)] Fixed scroll-progress class"
    }

    # ===== Step 2: Image-blur-up + data-src =====
    $imgRegex = [regex]'<img\s[^>]*?src="([^"]+\.(?:svg|jpg|png))"[^>]*/?>'
    $content = $imgRegex.Replace($content, {
        param($m)
        $tag = $m.Value
        $src = $m.Groups[1].Value

        # Skip logos and icon/favicon images
        if ($src -match '(?i)logo' -or $src -match '(?i)GG-College-Logo' -or $tag -match '(?i)(icon|favicon)') {
            return $tag
        }
        # Skip if already has image-blur-up
        if ($tag -match 'image-blur-up') {
            return $tag
        }
        # Add class
        if ($tag -match 'class="([^"]*)"') {
            $tag = $tag -replace 'class="([^"]*)"', 'class="$1 image-blur-up"'
        } else {
            $tag = $tag -replace '<img\s', '<img class="image-blur-up" '
        }
        # Add data-src if not already present
        if ($tag -notmatch 'data-src=') {
            $tag = $tag -replace '<img\s', "<img data-src=`"$src`" "
        }
        return $tag
    })
    # Count how many image-blur-up additions were made
    $newImgCount = [regex]::Matches($content, 'image-blur-up').Count
    $oldImgCount = [regex]::Matches($orig, 'image-blur-up').Count
    $imgRun = $newImgCount - $oldImgCount
    if ($imgRun -gt 0) {
        $imgFixed += $imgRun
        Write-Host "  [$(Split-Path $f -Leaf)] Added image-blur-up to $imgRun image(s)"
    }

    # ===== Step 3: Card-shine =====
    $cardRegex = [regex]'class="([^"]*card[^"]*)"'
    $content = $cardRegex.Replace($content, {
        param($m)
        $classVal = $m.Groups[1].Value
        $fullMatch = $m.Value
        # Skip if already has card-shine
        if ($classVal -match 'card-shine') {
            return $fullMatch
        }
        # Skip if contains 'logo'
        if ($classVal -match 'logo') {
            return $fullMatch
        }
        $newClassVal = $classVal + ' card-shine'
        return 'class="' + $newClassVal + '"'
    })
    $newCardCount = [regex]::Matches($content, 'card-shine').Count
    $oldCardCount = [regex]::Matches($orig, 'card-shine').Count
    $cardRun = $newCardCount - $oldCardCount
    if ($cardRun -gt 0) {
        $cardFixed += $cardRun
        Write-Host "  [$(Split-Path $f -Leaf)] Added card-shine to $cardRun element(s)"
    }

    # ===== Step 5: Reveal classes =====
    if ($revealTargets -contains $f) {
        if ($content -match '<main[^>]*>') {
            if ($content -match '<main[^>]*class="([^"]*)"') {
                $existingClass = $Matches[1]
                if ($existingClass -notmatch 'reveal') {
                    $content = $content -replace '(<main[^>]*class=")([^"]*)(")', '${1}${2} reveal${3}'
                    $revealFixed++
                    Write-Host "  [$(Split-Path $f -Leaf)] Added reveal to <main>"
                }
            } else {
                $content = $content -replace '(<main[^>]*)(>)', '${1} class="reveal"${2}'
                $revealFixed++
                Write-Host "  [$(Split-Path $f -Leaf)] Added reveal to <main>"
            }
        } elseif ($content -match '<section[^>]*>') {
            if ($content -match '<section[^>]*class="([^"]*)"' -and ($Matches[1] -notmatch 'reveal')) {
                $content = $content -replace '(<section[^>]*class=")([^"]*)(")', '${1}${2} reveal${3}'
                $revealFixed++
                Write-Host "  [$(Split-Path $f -Leaf)] Added reveal to <section>"
            } elseif ($content -notmatch '<section[^>]*class=') {
                $content = $content -replace '(<section[^>]*)(>)', '${1} class="reveal"${2}'
                $revealFixed++
                Write-Host "  [$(Split-Path $f -Leaf)] Added reveal to <section>"
            }
        }
    }

    if ($content -ne $orig) {
        Set-Content -LiteralPath $f -Value $content -NoNewline
        Write-Host "  -> Saved changes to $(Split-Path $f -Leaf)"
    } else {
        Write-Host "  [$(Split-Path $f -Leaf)] No changes needed"
    }
    Write-Host ""
}

Write-Host "============================================"
Write-Host "SUMMARY:"
Write-Host "  Scroll-progress added: $scrollAdded"
Write-Host "  Scroll-progress fixed: $scrollFixed"
Write-Host "  Image-blur-up added:   $imgFixed"
Write-Host "  Card-shine added:      $cardFixed"
Write-Host "  Reveal classes added:  $revealFixed"
Write-Host "============================================"

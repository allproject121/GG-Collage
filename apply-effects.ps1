param([switch]$DryRun)

$pagesDir = "C:\Users\Satyam\Downloads\WD\GG Collage\public\pages"
$publicDir = "C:\Users\Satyam\Downloads\WD\GG Collage\public"

$groupA = @(
    'accessibility-statement.html', 'admissions.html', 'alumni.html', 'committees.html',
    'contact.html', 'downloads.html', 'faculty.html', 'notices.html',
    'privacy-policy.html', 'sitemap.html'
)
$groupB = @(
    'about.html', 'academic.html', 'activities.html', 'addon-courses.html',
    'career-katta.html', 'departments.html', 'events.html', 'facilities.html',
    'gallery.html', 'grievance.html', 'iqac.html', 'library.html',
    'media-centre.html', 'naac.html', 'nep.html', 'nirf.html',
    'programmes.html', 'recruiters.html', 'student-corner.html', 'swayam.html', 'wdc.html'
)
$groupC = @(
    'admission-apply.html', 'admission-status.html', 'co-mapping.html',
    'course-outcomes.html', 'examination.html', 'programme-outcomes.html'
)
$groupD = @('index.html')

function Save-File($filePath, $content) {
    $name = Split-Path $filePath -Leaf
    if ($DryRun) { Write-Host "  [DRY-RUN] $name" }
    else {
        $content | Set-Content -Path $filePath -NoNewline -Encoding UTF8
        Write-Host "  [SAVED] $name"
    }
}

function Process-Page($filename, $group) {
    if ($filename -eq 'index.html' -or $filename -eq 'sitemap.html') {
        $filePath = "$publicDir\$filename"
    } else {
        $filePath = "$pagesDir\$filename"
    }
    if (!(Test-Path $filePath)) { Write-Host "  [SKIP] $filename not found at $filePath"; return $null }
    
    Write-Host "`n=== $filename (Group $group) ==="
    $html = Get-Content -Path $filePath -Raw -Encoding UTF8
    $original = $html
    
    # ---- 2. scroll-progress (all except index.html which already has it) ----
    if ($filename -ne 'index.html' -and $html -notmatch 'id="scrollProgress"') {
        $bar = '<div class="scroll-progress" id="scrollProgress" role="progressbar" aria-label="Page scroll progress"></div>'
        $html = $html -replace '(?<=<body[^>]*>)', "`r`n  $bar"
        Write-Host "  + scroll-progress"
    }
    
    # ---- 3. glass-card to section elements (all) ----
    $html = [regex]::Replace($html, '(?i)(<section\s[^>]*?class="(?:section(?:\s[^"]*?)?))(?:")', {
        param($m)
        $full = $m.Groups[1].Value
        if ($full -match 'page-header|hero|section-dark') { return $m.Value }
        if ($full -match 'glass-card') { return $m.Value }
        return "$full glass-card`""
    })
    Write-Host "  + glass-card (sections)"
    
    # ---- 4. card-shine (B, C, D) ----
    if ($group -in 'B', 'C', 'D') {
        $html = [regex]::Replace($html, '(?i)(class="[^"]*\bcard\b[^"]*")', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'card-shine') { return $c }
            if ($c -match '(?:facility-card|admission-card|quick-link-card|leadership-card|vm-card|stat-card|course-card|notice-item)') { return $c }
            return $c -replace '"$', ' card-shine"'
        })
        Write-Host "  + card-shine"
    }
    
    # ---- 8. reveal to section-header + reveal-stagger to grids (all) ----
    $html = [regex]::Replace($html, '(?i)(class="section-header[^"]*")', {
        param($m)
        $c = $m.Groups[1].Value
        if ($c -match '\breveal\b') { return $c }
        return $c -replace '"$', ' reveal"'
    })
    $html = [regex]::Replace($html, '(?i)(class="(?:grid-[234]|stats-grid|quick-links-grid|gallery-grid|featured-grid|downloads-grid|admission-cards|notice-group|faculty-grid)[^"]*")', {
        param($m)
        $c = $m.Groups[1].Value
        if ($c -match 'reveal-stagger') { return $c }
        return $c -replace '"$', ' reveal-stagger"'
    })
    Write-Host "  + reveal / reveal-stagger"
    
    # ---- 9. image-blur-up to images (all) ----
    $html = [regex]::Replace($html, '(?i)<img\s([^>]*?)/?>', {
        param($m)
        $img = $m.Value
        $attrs = $m.Groups[1].Value
        if ($attrs -match 'image-blur-up') { return $img }
        if ($attrs -match 'Logo\.svg|banner-image') { return $img }
        $src = if ($attrs -match 'src\s*=\s*"([^"]+)"') { $matches[1] } else { '' }
        if (!$src) { return $img }
        if ($attrs -notmatch 'data-src\s*=') {
            $attrs = $attrs -replace 'src\s*=\s*"[^"]*"', "src=`"$src`" data-src=`"$src`""
        }
        if ($attrs -notmatch 'loading\s*=') { $attrs += ' loading="lazy"' }
        if ($attrs -notmatch 'class\s*=') { $attrs += ' class="image-blur-up"' }
        else {
            $attrs = [regex]::Replace($attrs, '(class\s*=\s*")([^"]*)', '${1}${2} image-blur-up')
        }
        return "<img $attrs>"
    })
    Write-Host "  + image-blur-up"
    
    # ---- 10. btn-arrow (all) ----
    $html = [regex]::Replace($html, '(?i)(class="btn[^"]*(?:btn-primary|btn-outline|btn-secondary)[^"]*")', {
        param($m)
        $c = $m.Groups[1].Value
        if ($c -match 'btn-arrow') { return $c }
        return $c -replace '"$', ' btn-arrow"'
    })
    Write-Host "  + btn-arrow"
    
    # ---- 6. magnetic (C, D) ----
    if ($group -in 'C', 'D') {
        $html = [regex]::Replace($html, '(?i)(class="btn[^"]*\bbtn-primary\b[^"]*")', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'magnetic') { return $c }
            return $c -replace '"$', ' magnetic"'
        })
        Write-Host "  + magnetic"
    }
    
    # ---- 11. card-gold-top (B, C, D) ----
    if ($group -in 'B', 'C', 'D') {
        $html = [regex]::Replace($html, '(?i)(class="[^"]*\bcard\b[^"]*")', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'card-gold-top') { return $c }
            if ($c -match '(?:facility-card|admission-card|quick-link-card|leadership-card|vm-card|stat-card|course-card|notice-item)') { return $c }
            return $c -replace '"$', ' card-gold-top"'
        })
        Write-Host "  + card-gold-top"
    }
    
    # ---- 13. gradient-mesh (B, C, D) ----
    if ($group -in 'B', 'C', 'D' -and $html -notmatch 'gradient-mesh') {
        $html = [regex]::Replace($html, '(?i)(class="[^"]*\bsection-dark\b[^"]*?)"(?:\s|>)', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'gradient-mesh') { return $m.Value }
            return "$c gradient-mesh`""
        })
        Write-Host "  + gradient-mesh"
    }
    
    # ---- 16. glow-gold (B, C, D) ----
    if ($group -in 'B', 'C', 'D') {
        $html = [regex]::Replace($html, '(?i)(class="btn[^"]*\bbtn-primary\b[^"]*")', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'glow-gold') { return $c }
            return $c -replace '"$', ' glow-gold"'
        })
        Write-Host "  + glow-gold"
    }
    
    # ---- 14. parallax-section + parallax-bg (pages with hero section) ----
    if ($html -match '(?i)class="\w*hero') {
        $html = [regex]::Replace($html, '(?i)(class="hero(?:\s[^"]*?)?)"(?:\s|>)', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'parallax-section') { return $m.Value }
            return "$c parallax-section`""
        })
        $html = [regex]::Replace($html, '(?i)(class="hero-bg[^"]*?)"(?:\s|>)', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'parallax-bg') { return $m.Value }
            return "$c parallax-bg`""
        })
        Write-Host "  + parallax-section / parallax-bg"
    }
    
    # ---- 12. ken-burns to hero-bg images ----
    if ($html -match 'hero-bg') {
        $html = [regex]::Replace($html, '(?i)(<div\s[^>]*class="hero-bg[^"]*"[\s\S]*?<img\s[^>]*?)(class=")([^"]*)', {
            param($m)
            $pre = $m.Groups[1].Value
            $open = $m.Groups[2].Value
            $cls = $m.Groups[3].Value
            if ($cls -match 'ken-burns') { return $m.Value }
            return "${pre}${open}ken-burns $cls"
        })
        Write-Host "  + ken-burns"
    }
    
    # ---- 7. curtain-reveal (D - index.html hero) ----
    if ($group -eq 'D') {
        $html = [regex]::Replace($html, '(?i)(class="[^"]*\bhero-content\b[^"]*?)"(?:\s|>)', {
            param($m)
            $c = $m.Groups[1].Value
            if ($c -match 'curtain-reveal') { return $m.Value }
            return "$c curtain-reveal`""
        })
        Write-Host "  + curtain-reveal"
    }
    
    # ---- 15. timeline to step/section process content (C) ----
    if ($group -eq 'C' -and $html -match '(?i)Step \d|timeline') {
        if ($html -notmatch 'timeline-item') {
            $html = $html -replace '(?i)(class="grid-3)(?!.*\btimeline\b)"', '$1 timeline"'
            Write-Host "  + timeline"
        }
    }
    
    if ($html -eq $original) { Write-Host "  [NO CHANGES]"; return $null }
    
    Save-File $filePath $html
    return "OK"
}

# ===== MAIN =====
$fileMap = @()
foreach ($f in $groupA) { $fileMap += @{File=$f; Group='A'} }
foreach ($f in $groupB) { $fileMap += @{File=$f; Group='B'} }
foreach ($f in $groupC) { $fileMap += @{File=$f; Group='C'} }
foreach ($f in $groupD) { $fileMap += @{File=$f; Group='D'} }

$modified = 0; $total = $fileMap.Count
foreach ($item in $fileMap) {
    $result = Process-Page $item.File $item.Group
    if ($result) { $modified++ }
}

Write-Host "`n`n========================================"
Write-Host "DONE: $modified of $total files modified"
if ($DryRun) { Write-Host "(DRY RUN - no files saved)" }
Write-Host "========================================"

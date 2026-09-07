$port = 3000
$root = "C:\Users\Satyam\Downloads\WD\GG Collage"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port"
Write-Host "Press Ctrl+C to stop"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }
    
    $filePath = Join-Path $dir $path
    $dir = "C:\Users\Satyam\Downloads\WD\GG Collage"
    $filePath = Join-Path $dir $path
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = switch ([System.IO.Path]::GetExtension($filePath)) {
            '.html' { 'text/html; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            '.jpg'  { 'image/svg+xml' }
            '.png'  { 'image/svg+xml' }
            '.svg'  { 'image/svg+xml' }
            default { 'application/octet-stream' }
        }
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}

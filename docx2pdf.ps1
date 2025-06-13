param(
    [Parameter(Mandatory=$true)]
    [string]$InputPath,
    
    [Parameter(Mandatory=$true)]
    [string]$OutputPath
)

# Convertir les chemins relatifs en absolus
$InputPath = [System.IO.Path]::GetFullPath($InputPath)
$OutputPath = [System.IO.Path]::GetFullPath($OutputPath)

Write-Host "🔄 Conversion de $InputPath vers $OutputPath"

# Créer l'objet Word
$Word = New-Object -ComObject Word.Application
$Word.Visible = $false

try {
    # Ouvrir le document
    $Doc = $Word.Documents.Open($InputPath)
    
    $Doc.SaveAs2($OutputPath, 17)  # 17 = PDF format
    
    $Doc.Close()
    Write-Host "✅ Conversion terminée avec succès"
    
} catch {
    Write-Error "❌ Erreur lors de la conversion: $_"
    throw
} finally {
    $Word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($Word) | Out-Null
    [System.GC]::Collect()
}

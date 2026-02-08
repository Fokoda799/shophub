param (
    [string[]]$Exclude = @(
        "node_modules",
        ".git",
        "dist",
        "build",
        "out",
        "vendor",
        ".next"
    )
)

function Show-Tree {
    param (
        [string]$Path,
        [string]$Prefix = ""
    )

    $items = Get-ChildItem -LiteralPath $Path -Force |
             Where-Object { $Exclude -notcontains $_.Name }

    $count = $items.Count
    $index = 0

    Write-Output "$Prefix$Path"

    foreach ($item in $items) {
        $index++
        $isLast = ($index -eq $count)

        $branch = if ($isLast) { "└── " } else { "├── " }

        # ✅ Print ONLY the name
        Write-Output "$Prefix$branch$($item.Name)"

        if ($item.PSIsContainer) {
            $newPrefix = if ($isLast) { "$Prefix    " } else { "$Prefix│   " }
            Show-Tree -Path $item.FullName -Prefix $newPrefix
        }
    }
}

Show-Tree -Path (Get-Location)

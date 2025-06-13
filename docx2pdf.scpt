on run argv
    if (count of argv) < 2 then
        return "❌ Usage: osascript script.scpt input.docx output.pdf"
    end if
    
    set inputFile to item 1 of argv
    set outputFile to item 2 of argv
    
    try
        tell application "Microsoft Word"
            activate
            
            -- Ouvrir le document avec le chemin POSIX
            open POSIX file inputFile

            -- Petit délai pour s'assurer que le document est chargé
            delay 2
            
            -- Sauvegarder le document actif en PDF
            save as active document file name outputFile file format format PDF
            
            -- Fermer le document
            close active document saving no

            return "✅ Conversion réussie: " & outputFile
        end tell
        
    on error errMsg
        return "❌ Erreur: " & errMsg
    end try
end run
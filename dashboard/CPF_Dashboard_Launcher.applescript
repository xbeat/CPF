-- CPF Dashboard Launcher
-- AppleScript source code for macOS app
-- Save as Application with "Stay open after run handler" enabled

property terminalWindowID : missing value

on run
    set dashboardPath to findDashboardPath()

    if dashboardPath is "" then
        display alert "Errore" message "Cartella dashboard non trovata"
        quit me
        return
    end if

    try
        do shell script "/usr/bin/lsof -ti:3000 | /usr/bin/xargs /bin/kill -9 2>/dev/null"
    end try

    delay 1

    set npmPath to ""
    try
        set npmPath to do shell script "/bin/ls -1d $HOME/.nvm/versions/node/*/bin 2>/dev/null | /usr/bin/tail -1"
    end try
    if npmPath is "" then
        set npmPath to "/usr/local/bin"
    end if

    try
        tell application "Terminal"
            activate
            do script "cd " & quoted form of dashboardPath & " && export PATH='" & npmPath & ":/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH' && /bin/bash start.sh"
            set terminalWindowID to id of front window
        end tell
    on error errMsg
        display dialog "Errore: " & errMsg
        quit me
    end try
end run

on idle
    try
        tell application "Terminal" to get window id terminalWindowID
        return 2
    on error
        quit me
    end try
end idle

on quit
    try
        do shell script "/usr/bin/lsof -ti:3000 | /usr/bin/xargs /bin/kill -9 2>/dev/null"
    end try
    try
        tell application "Terminal"
            if (exists window id terminalWindowID) then
                close window id terminalWindowID
            end if
        end tell
    end try
    continue quit
end quit

on findDashboardPath()
    set configFile to (POSIX path of (path to home folder)) & ".cpf_dashboard_path"

    try
        set savedPath to do shell script "/bin/cat " & quoted form of configFile
        if (do shell script "/bin/test -f " & quoted form of (savedPath & "/start.sh") & " && echo yes") is "yes" then
            return savedPath
        end if
    end try

    set homeDir to POSIX path of (path to home folder)
    set possiblePaths to {homeDir & "CPF/dashboard", homeDir & "Desktop/CPF/dashboard", homeDir & "Documents/CPF/dashboard", homeDir & "Projects/CPF/dashboard"}

    try
        set lavoriDirs to paragraphs of (do shell script "/bin/ls -1d " & quoted form of (homeDir & "Lavori/*/github/CPF/dashboard") & " 2>/dev/null")
        set possiblePaths to possiblePaths & lavoriDirs
    end try

    repeat with aPath in possiblePaths
        try
            if (do shell script "/bin/test -f " & quoted form of (aPath & "/start.sh") & " && echo yes") is "yes" then
                do shell script "/bin/echo " & quoted form of aPath & " > " & quoted form of configFile
                return aPath
            end if
        end try
    end repeat

    set selectedFolder to choose folder with prompt "Seleziona la cartella dashboard (con start.sh):"
    set selectedPath to POSIX path of selectedFolder
    if selectedPath ends with "/" then
        set selectedPath to text 1 thru -2 of selectedPath
    end if

    try
        if (do shell script "/bin/test -f " & quoted form of (selectedPath & "/start.sh") & " && echo yes") is "yes" then
            do shell script "/bin/echo " & quoted form of selectedPath & " > " & quoted form of configFile
            return selectedPath
        end if
    end try

    return ""
end findDashboardPath

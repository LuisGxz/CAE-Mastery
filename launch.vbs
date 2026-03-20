' CAE Mastery — launcher de escritorio
' Primero hace el build de la app y luego abre Electron como ventana nativa.
' Sin CMD visible, sin navegador — ventana propia como cualquier app.

Dim objShell
Set objShell = WScript.CreateObject("WScript.Shell")

' npm run app = vite build && electron .
objShell.Run "cmd /c cd /d ""C:\Aprendizaje\Ingles\cae-mastery"" && npm run app", 0, False

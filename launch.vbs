' CAE Mastery — launcher silencioso
' Arranca npm run dev sin mostrar ninguna ventana CMD.
' Vite abre el navegador automáticamente (server.open = true en vite.config.js).
' Si el servidor ya está corriendo en el puerto 5173, este script falla
' silenciosamente y el navegador que ya tenías abierto sigue funcionando.

Set WshShell = WScript.CreateObject("WScript.Shell")

WshShell.Run "cmd /c cd /d ""C:\Aprendizaje\Ingles\cae-mastery"" && npm run dev", 0, False

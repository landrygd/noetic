call ionic cordova build --release android
cd .\platforms\android
call .\gradlew.bat bundle
cd .\app\build\outputs\bundle\release
copy ..\..\..\..\..\..\..\..\..\keystores\noetic.keystore .\noetic.keystore
call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore noetic.keystore -storepass "9pZC3F4dn" -keypass "wAf8fA36A" app.aab noetic
zipalign -v 4 app.aab noetic.aab
call explorer .
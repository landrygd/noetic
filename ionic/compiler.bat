ionic cordova build --release android
cd .\platforms\android
./gradlew.bat bundle
cd .\platforms\android\app\build\outputs\bundle\release
copy ..\..\keystores\noetic.keystore .\android\app\build\outputs\bundle\release\noetic.keystore
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore noetic.keystore app.aab noetic
zipalign -v 4 app.aab noetic.aab
explorer .\platforms\android\app\build\outputs\bundle\release
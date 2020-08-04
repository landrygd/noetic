ionic cordova build --release android
cd .\platforms\android
./gradlew.bat bundle
cd .\platforms\android\app\build\outputs\bundle\release
copy ..\..\keystores\noetic.keystore C:\Users\GAMING\Projets\noetic\ionic\platforms\android\app\build\outputs\bundle\release\noetic.keystore
echo 9pZC3F4dn
echo wAf8fA36A
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore noetic.keystore app.aab noetic
zipalign -v 4 app.aab noetic.aab
explorer .\platforms\android\app\build\outputs\bundle\release
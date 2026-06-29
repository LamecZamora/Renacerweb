# RENACER como app Android (APK) 📱

La app web (`apps/web`) está envuelta con **Capacitor**, que empaqueta el build web dentro de un
proyecto Android nativo. El APK resultante **incluye toda la app dentro** y funciona **100% offline**
(no necesita servidor): los datos siguen viviendo en el dispositivo (localStorage del WebView).

## ✅ APK ya generado

- Archivo: **`RENACER.apk`** (raíz del repo `renacer/`), ~4.4 MB.
- Firmado con la *debug keystore* de Android (válido para instalar tú mismo / compartir).
- App id: `com.renacer.app` · Nombre: **RENACER** · minSDK 24 (Android 7+) · target SDK 36.

### Instalar en tu teléfono
1. Pasa `RENACER.apk` al celular (cable USB, WhatsApp, Drive, correo…).
2. En el teléfono, ábrelo. Si pide permiso, activa **"Instalar apps desconocidas"** para esa app.
3. Toca **Instalar**. Listo: aparece el ícono "RENACER" en tu pantalla de inicio. 🎉

## 🔁 Regenerar el APK (tras cambios en la web)

Requisitos (ya presentes en esta máquina): **JDK 17+** y el **Android SDK** (Android Studio).
El SDK se localiza vía `apps/web/android/local.properties` (`sdk.dir=...`).

```bash
cd renacer/apps/web
npm run apk          # build web + cap sync + gradlew assembleDebug
# APK en: apps/web/android/app/build/outputs/apk/debug/app-debug.apk
```

O paso a paso:
```bash
npm run build                 # genera dist/
npx cap sync android          # copia dist/ al proyecto android
cd android && ./gradlew assembleDebug
```

Para abrir el proyecto en Android Studio: `npm run apk:open`.

## 🚀 APK/AAB de producción (Play Store)

El APK actual es *debug*. Para publicar en Play Store necesitas un **AAB firmado con tu propia keystore**:

```bash
# 1) crear keystore (una sola vez)
keytool -genkey -v -keystore renacer.keystore -alias renacer -keyalg RSA -keysize 2048 -validity 10000
# 2) configurar la firma en android/app/build.gradle (signingConfigs) o en Android Studio
# 3) generar el bundle de producción
cd apps/web/android && ./gradlew bundleRelease   # -> app/build/outputs/bundle/release/app-release.aab
```

Luego subes el `.aab` a Google Play Console (cuenta de desarrollador: pago único de 25 USD).

## 🎨 Pendiente opcional

- **Ícono de app personalizado** (hoy usa el ícono por defecto de Capacitor). Se genera con
  `@capacitor/assets` a partir de una imagen 1024×1024, o editando los recursos `mipmap`/adaptive-icon.
- **Splash screen** de marca (con `@capacitor/splash-screen`).

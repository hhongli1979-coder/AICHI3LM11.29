# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native - Keep all React Native classes and methods
-keep public class com.facebook.react.** { *; }
-keepclassmembers class com.facebook.react.** { *; }
-keep public interface com.facebook.react.** { *; }

# React Native specific rules - Less aggressive optimization
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.jscexecutor.** { *; }
-keep class com.facebook.react.devsupport.** { *; }
-keep class com.facebook.react.devsupport.interfaces.** { *; }
-keep class com.facebook.react.modules.debug.** { *; }

# React Native Android specific rules
-keep public class com.facebook.react.modules.network.** { *; }
-keep public class com.facebook.react.modules.storage.** { *; }
-keep public class com.facebook.react.modules.camera.** { *; }
-keep public class com.facebook.react.modules.clipboard.** { *; }
-keep public class com.facebook.react.modules.websocket.** { *; }
-keep public class com.facebook.react.modules.intent.** { *; }
-keep public class com.facebook.react.modules.location.** { *; }

# OkHttp - Keep OkHttp classes
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

# Okio - Keep Okio classes
-keep class okio.** { *; }
-dontwarn okio.**

# Gson - Keep Gson classes and annotations
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-keep class com.google.gson.stream.** { *; }
-keep class com.google.gson.internal.** { *; }
-keep class com.google.gson.annotations.** { *; }

# Firebase - Keep all Firebase classes
-keep class com.google.firebase.** { *; }
-keep class com.google.firebase.firestore.** { *; }
-keep class com.google.firebase.firestore.model.** { *; }
-keep class com.google.firebase.firestore.util.** { *; }
-keep class com.google.firebase.auth.** { *; }
-keep class com.google.firebase.messaging.** { *; }
-keep class com.google.firebase.storage.** { *; }

# Google Services
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Android support library and AndroidX
-keep class androidx.** { *; }
-keep interface androidx.** { *; }
-keep class android.** { *; }
-keep interface android.** { *; }
-dontwarn androidx.**

# Geolocation and location services
-keep class com.google.android.gms.location.** { *; }
-keep class com.google.android.gms.common.** { *; }
-keep class com.reactnativecommunity.geolocation.** { *; }
-keep class com.github.reactnativecommunity.location.** { *; }

# Other common libraries
-keep class com.squareup.** { *; }
-keep interface com.squareup.** { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }

# React Native SVG
-keep class com.horcrux.svg.** { *; }

# React Native Push Notification
-keep class com.dieam.reactnativepushnotification.** { *; }

# React Native Async Storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# React Native Device Info
-keep class com.learnium.RNDeviceInfo.** { *; }

# React Native Image Picker
-keep class com.imagepicker.** { *; }

# React Native FS
-keep class com.rnfs.** { *; }

# React Native Sound
-keep class com.zmxv.RNSound.** { *; }

# React Native WebView
-keep class com.reactnativecommunity.webview.** { *; }
-keep class com.android.webview.** { *; }

# React Navigation
-keep class com.reactnavigation.** { *; }

# Redux
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# rn-tourguide
-keep class com.reactnativetourguide.** { *; }

# Bottom Sheet
-keep class com.gorhom.bottomsheet.** { *; }

# JavaScriptCore and related
-dontwarn com.facebook.jni.**
-dontwarn com.facebook.react.modules.blob.**
-dontwarn com.facebook.react.modules.websocket.**

# IndexedDB related warnings - these are JavaScript variables, not Java
-dontwarn IDBIndex
-dontwarn IDBObjectStore
-dontwarn IDBCursor
-dontwarn IDBTransaction
-dontwarn DOMException
-dontwarn IDBRequest

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep setters in Views so that animations can still work
-keepclassmembers public class * extends android.view.View {
   void set*(***);
   *** get*();
}

# Keep classes that are referenced on the AndroidManifest
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class com.google.android.gms.common.internal.safeparcel.SafeParcelable {
    public static final *** NULL;
}

# Keep annotations
-keepattributes *Annotation*

# Keep track of generic type information
-keepattributes Signature

# Keep all .class method names
-keepclassmembernames class * {
    java.lang.Class class$(java.lang.String);
    java.lang.Class class$(java.lang.String, boolean);
}

# Keep InnerClasses
-keepattributes InnerClasses

# Keep declared classes and their members
-keepclasseswithmembers class * {
    native <methods>;
}

# Keep special methods
-keepclassmembers class * extends android.app.Activity {
   public void *(android.view.View);
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable classes
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Less aggressive optimization to prevent crashes
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*,!code/allocation/variable
-optimizationpasses 3
-allowaccessmodification
-dontobfuscate

# Reduce information printed to the console
-verbose
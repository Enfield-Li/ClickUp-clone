# Trying out React Native development

### **Using typescript, [Expo framework](https://expo.dev/) and [tailwindcss](https://tailwindcss.com/) for styling([TailNative integration](https://www.nativewind.dev/))**

reverse port for localhost connection:

```
adb reverse tcp:8099 tcp:8099
```

components:

```
// icon
import Icon from "react-native-vector-icons/FontAwesome";
<Icon size={20} name="paper-plane" color="rgb(122, 104, 240)" />

// button
<TouchableOpacity
  href="my_test"
  className="w-11/12 bg-purple-500 py-3 rounded-lg mx-auto mb-6 text-center"
>
  <Text className="text-white">Get started</Text>
</TouchableOpacity>
```

Build:
`npx expo prebuild`
`npx expo run:android`

```
FAILURE: Build completed with 2 failures.

1: Task failed with an exception.
-----------
* Where:
Script 'D:\development\projects\clickup_clone_mobile\node_modules\expo-modules-autolinking\scripts\android\autolinking_implementation.gradle' line: 326

* What went wrong:
A problem occurred evaluating project ':expo'.
> A problem occurred configuring project ':expo-modules-core'.
   > Failed to notify project evaluation listener.
      > SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting
the sdk.dir path in your project's local properties file at 'D:\development\projects\clickup_clone_mobile\android\local.properties'.
      > Could not get unknown property 'release' for SoftwareComponentInternal set of type org.gradle.api.internal.component.DefaultSoftwareComponentContainer.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
==============================================================================

2: Task failed with an exception.
-----------
* What went wrong:
A problem occurred configuring project ':expo'.
> compileSdkVersion is not specified. Please add it to build.gradle

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
==============================================================================

* Get more help at https://help.gradle.org
```

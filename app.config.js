module.exports = {
  expo: {
    name: 'my-ecommerce-app',
    slug: 'my-ecommerce-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    plugins: [
      'expo-dev-client',
      'expo-camera',
      'expo-location',
      'expo-image-picker',
      'expo-barcode-scanner',
      'expo-secure-store' // added this plugin as advised
    ],
    android: {
      package: 'com.daemonsav999.ecommercebeta2',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      permissions: [
        'CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ]
    },
    ios: {
      bundleIdentifier: 'com.daemonsav999.ecommercebeta2',
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "This app needs access to your camera to scan barcodes and take photos.",
        NSLocationWhenInUseUsageDescription: "This app needs access to your location for delivery services.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library to upload product images."
      }
    },
    extra: {
      eas: {
        projectId: 'b85afbd8-e853-449e-b3c9-7de9d54ef1b3'
      }
    }
  }
};

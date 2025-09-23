import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.78dde8ef0fa14be38c63df4062c429e1',
  appName: 'jobjua-emerge-connect',
  webDir: 'dist',
  server: {
    url: 'https://78dde8ef-0fa1-4be3-8c63-df4062c429e1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999'
    }
  }
};

export default config;
import {
  AdMob,
  AdOptions,
  InterstitialAdPluginEvents,
  AdmobConsentStatus,
} from "@capacitor-community/admob";

export async function initializeAdmob(): Promise<void> {
  await AdMob.initialize();

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo(),
  ]);

  if (trackingInfo.status === "notDetermined") {
    await AdMob.requestTrackingAuthorization();
  }

  const authorizationStatus = await AdMob.trackingAuthorizationStatus();
  if (
    authorizationStatus.status === "authorized" &&
    consentInfo.isConsentFormAvailable &&
    consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm();
  }
}

export async function showInterstitial(): Promise<void> {
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
    // Subscribe prepared interstitial
  });

  const options: AdOptions = {
    adId: "ca-app-pub-3239733554197124/7697731114",
    // isTesting: true
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
}

import {
  AdMob,
  AdOptions,
  InterstitialAdPluginEvents,
  AdmobConsentStatus,
} from "@capacitor-community/admob";

if (typeof window !== "undefined" && navigator.userAgent.includes("Chrome")) {
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    const stack = new Error().stack || "";
    if (stack.includes("AdMobWeb.")) return;
    originalLog(...args);
  };
}

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
  const lastAd = localStorage.getItem("lastAdTime");
  const now = Date.now();
  // 15 minutes cooldown
  if (lastAd && now - Number(lastAd) < 15 * 60 * 1000) {
    return;
  }
  
  // 25% chance to show ad even after cooldown
  if (Math.random() > 0.25) {
    return;
  }

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
  localStorage.setItem("lastAdTime", now.toString());
}


package com.cookieukw.vex;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SecretBridge")
public class SecretBridge extends Plugin {
    @PluginMethod
    public void getGeminiKey(PluginCall call) {
        String key = BuildConfig.VEX_GEMINI_KEY;
        JSObject ret = new JSObject();
        ret.put("key", key);
        call.resolve(ret);
    }
}
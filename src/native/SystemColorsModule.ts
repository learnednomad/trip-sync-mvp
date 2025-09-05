/**
 * System Colors Native Module Interface
 * This defines the interface for the native module that extracts system colors
 * Actual implementation would be in native iOS/Android code
 */

export interface SystemColorsModuleInterface {
  // iOS Methods
  getSystemColors(): Promise<{
    accentColor: string;
    isDynamicColorAvailable: boolean;
  }>;
  
  // Android Methods
  getMaterialYouColors(): Promise<{
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    isDynamicColorAvailable: boolean;
  }>;
  
  // Events
  addListener(eventName: 'onDynamicColorsChanged', callback: () => void): void;
  removeListeners(count: number): void;
}

/**
 * Instructions for native implementation:
 * 
 * iOS (SystemColors.swift):
 * ```swift
 * import UIKit
 * 
 * @objc(SystemColors)
 * class SystemColors: RCTEventEmitter {
 *   
 *   @objc
 *   func getSystemColors(_ resolve: @escaping RCTPromiseResolveBlock,
 *                        rejecter reject: @escaping RCTPromiseRejectBlock) {
 *     DispatchQueue.main.async {
 *       let accentColor: UIColor
 *       
 *       if #available(iOS 14.0, *) {
 *         accentColor = UIColor.tintColor
 *       } else {
 *         accentColor = UIColor.systemBlue
 *       }
 *       
 *       let hexColor = self.hexStringFromColor(color: accentColor)
 *       
 *       resolve([
 *         "accentColor": hexColor,
 *         "isDynamicColorAvailable": true
 *       ])
 *     }
 *   }
 *   
 *   private func hexStringFromColor(color: UIColor) -> String {
 *     var r: CGFloat = 0
 *     var g: CGFloat = 0
 *     var b: CGFloat = 0
 *     var a: CGFloat = 0
 *     
 *     color.getRed(&r, green: &g, blue: &b, alpha: &a)
 *     
 *     let rgb: Int = (Int)(r*255)<<16 | (Int)(g*255)<<8 | (Int)(b*255)<<0
 *     return String(format: "#%06x", rgb)
 *   }
 *   
 *   override func supportedEvents() -> [String]! {
 *     return ["onDynamicColorsChanged"]
 *   }
 * }
 * ```
 * 
 * Android (SystemColorsModule.kt):
 * ```kotlin
 * package com.sabrontripync
 * 
 * import android.os.Build
 * import androidx.annotation.RequiresApi
 * import com.facebook.react.bridge.*
 * import com.facebook.react.modules.core.DeviceEventManagerModule
 * import android.content.res.Configuration
 * import com.google.android.material.color.DynamicColors
 * import com.google.android.material.color.MaterialColors
 * 
 * class SystemColorsModule(reactContext: ReactApplicationContext) : 
 *   ReactContextBaseJavaModule(reactContext) {
 *   
 *   override fun getName() = "SystemColors"
 *   
 *   @ReactMethod
 *   fun getMaterialYouColors(promise: Promise) {
 *     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
 *       try {
 *         val context = reactApplicationContext
 *         val primaryColor = MaterialColors.getColor(
 *           context, 
 *           com.google.android.material.R.attr.colorPrimary, 
 *           0
 *         )
 *         val secondaryColor = MaterialColors.getColor(
 *           context,
 *           com.google.android.material.R.attr.colorSecondary,
 *           0
 *         )
 *         val tertiaryColor = MaterialColors.getColor(
 *           context,
 *           com.google.android.material.R.attr.colorTertiary,
 *           0
 *         )
 *         
 *         val result = Arguments.createMap().apply {
 *           putString("primaryColor", String.format("#%06X", 0xFFFFFF and primaryColor))
 *           putString("secondaryColor", String.format("#%06X", 0xFFFFFF and secondaryColor))
 *           putString("tertiaryColor", String.format("#%06X", 0xFFFFFF and tertiaryColor))
 *           putBoolean("isDynamicColorAvailable", DynamicColors.isDynamicColorAvailable())
 *         }
 *         
 *         promise.resolve(result)
 *       } catch (e: Exception) {
 *         promise.reject("ERROR", "Failed to get Material You colors", e)
 *       }
 *     } else {
 *       val result = Arguments.createMap().apply {
 *         putString("primaryColor", "#2563EB")
 *         putString("secondaryColor", "#7C3AED")
 *         putString("tertiaryColor", "#0891B2")
 *         putBoolean("isDynamicColorAvailable", false)
 *       }
 *       promise.resolve(result)
 *     }
 *   }
 *   
 *   private fun sendEvent(eventName: String, params: WritableMap?) {
 *     reactApplicationContext
 *       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
 *       .emit(eventName, params)
 *   }
 *   
 *   // Listen for configuration changes
 *   init {
 *     reactApplicationContext.addLifecycleEventListener(object : LifecycleEventListener {
 *       override fun onHostResume() {
 *         // Check if colors changed and emit event
 *         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
 *           sendEvent("onDynamicColorsChanged", null)
 *         }
 *       }
 *       // ... other lifecycle methods
 *     })
 *   }
 * }
 * ```
 */

export const SystemColorsModuleStub: SystemColorsModuleInterface = {
  async getSystemColors() {
    // This is a stub - actual implementation would be in native code
    return {
      accentColor: '#007AFF', // iOS default blue
      isDynamicColorAvailable: false,
    };
  },
  
  async getMaterialYouColors() {
    // This is a stub - actual implementation would be in native code
    return {
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
      tertiaryColor: '#0891B2',
      isDynamicColorAvailable: false,
    };
  },
  
  addListener(eventName: string, callback: () => void) {
    // Stub implementation
    console.log(`Listener added for ${eventName}`);
  },
  
  removeListeners(count: number) {
    // Stub implementation
    console.log(`Removed ${count} listeners`);
  },
};
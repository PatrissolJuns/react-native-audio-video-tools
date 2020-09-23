
package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.util.UUID;

public class RNAudioVideoToolsModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNAudioVideoToolsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNAudioVideoTools";
  }

  @ReactMethod
   public void generateFile(String extension, Promise promise) {
     try {
       File outputDir = reactContext.getCacheDir();

       final String outputUri = String.format("%s/%s." + extension, outputDir.getPath(), UUID.randomUUID().toString());

       promise.resolve(outputUri);
     } catch (Exception e) {
       promise.reject(e);
     }
   }
}

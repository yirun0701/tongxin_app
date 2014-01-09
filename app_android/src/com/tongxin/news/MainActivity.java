package com.tongxin.news;

import android.os.Bundle;
import org.apache.cordova.*;
import android.view.Menu;
import com.strumsoft.websocket.phonegap.WebSocketFactory;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
        
    	// ∞Û∂®websocket÷ß≥÷
        appView.addJavascriptInterface(new WebSocketFactory(appView),
        "WebSocketFactory");
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
}

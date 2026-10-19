package com.umoja.sacco;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(DataTransferPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

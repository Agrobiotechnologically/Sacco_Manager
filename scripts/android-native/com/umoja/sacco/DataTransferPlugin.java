package com.umoja.sacco;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "DataTransfer")
public class DataTransferPlugin extends Plugin {
    @PluginMethod
    public void saveFile(PluginCall call) {
        String filename = call.getString("filename");
        String content = call.getString("content");
        String contentType = call.getString("contentType");
        if (filename == null || content == null || contentType == null) {
            call.reject("A filename, content, and content type are required.");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(contentType.split(";", 2)[0]);
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        startActivityForResult(call, intent, "saveFileResult");
    }

    @ActivityCallback
    private void saveFileResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            JSObject response = new JSObject();
            response.put("cancelled", true);
            call.resolve(response);
            return;
        }

        Uri destination = result.getData().getData();
        if (destination == null) {
            call.reject("The selected save location is unavailable.");
            return;
        }
        try (OutputStream output = getContext().getContentResolver().openOutputStream(destination)) {
            if (output == null) throw new IOException("Unable to open the selected save location.");
            output.write(call.getString("content").getBytes(StandardCharsets.UTF_8));
            JSObject response = new JSObject();
            response.put("cancelled", false);
            call.resolve(response);
        } catch (IOException error) {
            call.reject("Unable to save the export to the selected location.", error);
        }
    }
}

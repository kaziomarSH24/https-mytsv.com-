<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'name');
        return response()->json($settings);
    }

    public function updateSetting(Request $request)
    {
        $messages = [
            'settings.*.name.required' => 'Setting name is required.',
            'settings.*.value.required' => ':attribute is required.',
        ];

        // Create attributes array before validation
        $attributes = [];
        foreach ($request->settings as $index => $setting) {
            $attributes["settings.{$index}.value"] = str_replace('_', ' ', ucfirst($setting['name']));
        }

        $validatedData = $request->validate([
            'settings' => 'required|array',
            'settings.*.name' => 'required|string',
            'settings.*.value' => 'required',
        ], $messages, $attributes);

        foreach ($request->settings as $setting) {
            Setting::updateOrCreate(
                ['name' => $setting['name']],
                ['value' => $setting['value']]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

}
<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function Settings(Request $request)
    {
        $userId = Auth::user()->id;
        $request->validate([
            'name' => 'required',
            'full_name' => 'required',
            'email' => 'required|email|unique:users,email,' . $userId,
        ]);

        $user = User::find($userId);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => 'mimes:jpg,png,webp,gif|max:2048',
            ]);
            $avatar = $user->generateAvatar($request->file('avatar'));
        } else {
            $avatar = $user->avatar;
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'full_name' => $request->full_name,
            'phone_number' => $request->phone_number,
            'additional_info' => json_encode($request->additional_info),
            'avatar' => json_encode($avatar),
        ]);

        $user = User::where('id', $userId)->first();

        return response($user);
    }
}

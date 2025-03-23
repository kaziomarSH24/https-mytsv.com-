<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = User::latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $users = $query->paginate(9);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::find($id);
        return response()->json($user);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 400);
        }

        $user = User::find($request->id);

        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => 'mimes:jpg,hpeg,png,webp,gif|max:2048',
            ]);
            $avatar = $user->generateAvatar($request->file('avatar'));
        } else {
            $avatar = $user->avatar ?? null;
        }

        if ($user) {
            $user->update([
                'name' => $request->name,
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'additional_info' => json_encode($request->additional_info),
                'avatar' => json_encode($avatar),
            ]);
            return response()->json($user);
        }
        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }
}

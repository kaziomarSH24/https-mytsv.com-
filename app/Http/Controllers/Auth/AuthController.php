<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api'], ['except' => ['login', 'register', 'ForgotPassword']]);
    }

    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['status' => 'error', 'message' => 'Email or password incorrect'], 401);
        }

        return $this->respondWithToken($token);
    }
    public function register(Request $request)
    {
        // return $request->all();
        $request->validate([
            'name' => 'required',
            'full_name' => 'required',
            'email' => 'required|unique:users',
            'password' => 'required|min:3|confirmed',
        ]);

        $userId = User::create([
            'name' => $request->name,
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        // return 'done';
        $token = Auth::login($userId);
        return response(['status' => 'success', 'token' => $token, 'message' => 'Successfuly Registred.']);
    }
    public function me()
    {
        return response()->json(Auth::user());
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['status' => 'success', 'message' => 'Successfuly logged out.']);
    }

    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Exception;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback($provider)
    {
        try {
            $user = Socialite::driver($provider)->stateless()->user();
            if (!isset($user)) {
                return response(['status' => 'error', 'message' => 'user not found']);
            }

            $currentUser = User::where('email', $user->email)->first();

            if ($currentUser) {
                $token = Auth::login($currentUser);
                return $this->respondWithToken($token);
            } else {

                if ($provider == 'Google') {
                    $emailVerified = $user->user['email_verified'] ? date('Y-m-d H:i:s') : null;
                } else {
                    $emailVerified = null;
                }

                $user = User::create([
                    'name' => $user->name,
                    'full_name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'password' => Hash::make($user->id),
                    'email_verified_at' => $emailVerified,
                ]);

                $token = Auth::login($user);
                return $this->respondWithToken($token);
            }

        } catch (Exception $e) {
            return response(['status' => 'error', 'message' => $e->getMessage()]);
        }
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

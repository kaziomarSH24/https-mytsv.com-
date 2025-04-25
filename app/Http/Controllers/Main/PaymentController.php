<?php

namespace App\Http\Controllers\Main;

use App\Enums\Video\Status;
use App\Models\Transaction;
use App\Models\Video;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class PaymentController extends Controller
{
    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        if ($sessionId === null) {
            return;
        }

        $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

        if ($session->payment_status !== 'paid') {
            return;
        }

        $order = Transaction::where('transaction_id', $sessionId)->first();

        $order->update(['status' => 'completed']);

        Video::withTrashed()->find($order->video_id)->restore();

        return redirect('/');
        // return redirect()->back();
    }
}

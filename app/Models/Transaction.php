<?php

namespace App\Models;

use App\Enums\Video\Package;
use Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Cashier\Cashier;


class Transaction extends Model
{
    use HasFactory;

    protected $fillable = ['transaction_id', 'video_id', 'price', 'status'];

    public function createOrder($package, $videoId)
{
    $price_ids = [];

    if ($package == Package::PROMOTED || $package == Package::PREMIUM) {
        $price_ids[] = 'price_1Q4iXcB9uNXBCzh8d6fGt3yg';
    }
    // if ($package == Package::FILE || $package == Package::PREMIUM) {
    //     $price_ids[] = 'price_1Q4kseB9uNXBCzh8NqBXqFLK';
    // }
    if ($package == Package::FILE || $package == Package::PREMIUM) {
        $price_ids[] = 'price_1R6qE9E3HCOEW1L0KwcFL9lo';
    }

    $customer = Auth::user();

    if (!$customer->hasStripeId()) {
        $customer->createAsStripeCustomer();
    }


    $checkoutSession = $customer->checkout($price_ids, [
        'success_url' => route('checkout-success') . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => route('checkout-cancel') . '?session_id={CHECKOUT_SESSION_ID}',
        'automatic_tax' => ['enabled' => false],
        // 'payment_method_types' => ['card'],
        // 'mode' => 'payment',
    ]);


    $this->create([
        'status' => 'created',
        'video_id' => $videoId,
        'price' => count($price_ids) > 1 ? 199 : 99,
        'transaction_id' => $checkoutSession->id,
    ]);

    return $checkoutSession;
}
}

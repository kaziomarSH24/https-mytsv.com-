<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactFormController extends Controller
{
    public function submitForm(Request $request)
    {
        // Validate the request data
        $validatedData = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        if ($validatedData->fails()) {
            return response()->json(['errors' => $validatedData->errors()], 422);
        }
        
        // Send the email
        Mail::to(env('ADMIN_MAIL_TO_ADDRESS'))->send(new ContactFormMail($validatedData->validated()));
        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'Email sent successfully!'
        ], 200);
    }
}

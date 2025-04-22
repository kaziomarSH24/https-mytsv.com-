@component('mail::message')
# New Contact Form Submission

You have received a new contact form submission with the following details:

**Name**: {{ $contactData['name'] }}  
**Email**: {{ $contactData['email'] }}  
**Subject**: {{ $contactData['subject'] }}  

**Message**:  
{{ $contactData['message'] }}

---

Thank you for your attention to this message. Please take the necessary actions as required.

Best regards,  
{{ config('app.name') }}

@endcomponent



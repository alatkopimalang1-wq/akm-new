<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $prefix = $request->segment(1);

        if ($prefix === 'en') {
            app()->setLocale('en');
        } else {
            app()->setLocale('id');
        }

        return $next($request);
    }
}

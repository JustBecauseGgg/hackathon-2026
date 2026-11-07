<?php

use App\Http\Controllers\GigaChatController;
use Illuminate\Support\Facades\Route;

// Прокси к GigaChat (routerai): ключ живёт только на бэкенде, в браузер не попадает
Route::post('/gigachat/cards', [GigaChatController::class, 'cards']);
